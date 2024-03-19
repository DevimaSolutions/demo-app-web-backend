import { BadRequestException, Injectable } from '@nestjs/common';

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

    const data = await this.parseOnboardingDataFromRequest(user.id, request);

    const save = await this.usersRepository.save(this.usersRepository.merge(user, data));

    const result = await this.usersRepository.getOneWithRelations(userId, {
      usersToSkills: { softSkill: true },
    });

    const response = new OnboardingResponse(result);

    if (response.complete) {
      await this.usersRepository.save(
        this.usersRepository.merge(save, {
          profile: { isOnboardingCompleted: true },
        }),
      );
    }

    return response;
  }

  private async parseOnboardingDataFromRequest(userId: string, request: OnboardingRequest) {
    const { name = null, ...rest } = request?.firstStep ?? {};

    const usersToSkills = await this.softSkillsRepository.findSoftSkillsByIds(
      request?.fourthStep?.softSkills ?? [],
    );
    const user = name ? { name: { first: name }, usersToSkills } : { usersToSkills };

    return {
      ...user,
      profile: {
        ...rest,
        ...(request?.secondStep || {}),
        ...(request?.thirdStep || {}),
        user: {
          id: userId,
        },
      },
    };
  }

  async getOnboarding(userId: string) {
    const user = await this.usersRepository.getOneWithRelations(userId, {
      usersToSkills: { softSkill: true },
    });
    return new OnboardingResponse(user);
  }

  async remove(id: string) {
    const user = await this.usersRepository.getOne(id);

    await this.usersRepository.softRemove(user);
    return { message: successMessages.removeProfile };
  }
}
