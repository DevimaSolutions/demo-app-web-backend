import { BadRequestException, Injectable } from '@nestjs/common';
import { In } from 'typeorm';

import { errorMessages, successMessages } from '@/features/common';
import { OnboardingRequest, OnboardingResponse } from '@/features/profiles/dto';
import { SoftSkillsRepository } from '@/features/soft-skills';
import { UsersRepository } from '@/features/users';

@Injectable()
export class ProfilesService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly softSkillsRepository: SoftSkillsRepository,
  ) {}

  async onboarding(userId: string, request: OnboardingRequest) {
    const user = await this.usersRepository.getOne(userId);

    if (user?.profile?.isOnboardingCompleted) {
      throw new BadRequestException(errorMessages.onboardingAlreadyCompleted);
    }

    const data = await this.parseOnboardingDataFromRequest(request);

    let result = await this.usersRepository.save(this.usersRepository.merge(user, data));

    const response = new OnboardingResponse(result);

    if (response.complete) {
      result = await this.usersRepository.save(
        this.usersRepository.merge(result, { profile: { isOnboardingCompleted: true } }),
      );
      return new OnboardingResponse(result);
    }

    return response;
  }

  async parseOnboardingDataFromRequest(request: OnboardingRequest) {
    const { name = null, ...rest } = request?.firstStep ?? {};

    const softSkills = await this.findSoftSkills(request?.fourthStep?.softSkills ?? []);
    const user = name ? { name: { first: name }, softSkills } : { softSkills };

    return {
      ...user,
      profile: {
        ...rest,
        ...(request?.secondStep || {}),
        ...(request?.thirdStep || {}),
      },
    };
  }

  private async findSoftSkills(ids: string[]) {
    if (ids.length) {
      return await this.softSkillsRepository.findBy({ id: In(ids) });
    }

    return [];
  }

  async getOnboarding(userId: string) {
    const user = await this.usersRepository.getOne(userId);
    return new OnboardingResponse(user);
  }

  async remove(id: string) {
    const user = await this.usersRepository.getOne(id);

    await this.usersRepository.softRemove(user);
    return { message: successMessages.removeProfile };
  }
}
