import { BadRequestException, Injectable } from '@nestjs/common';

import { UserStatus } from '@/features/auth';
import { errorMessages } from '@/features/common';
import { OnboardingRequest, OnboardingResponse } from '@/features/profiles';
import { SoftSkillsRepository } from '@/features/soft-skills';
import { UsersRepository } from '@/features/users';

@Injectable()
export class ProfileOnboardingService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly softSkillsRepository: SoftSkillsRepository,
  ) {}
  async onboarding(userId: string, request: OnboardingRequest) {
    const user = await this.usersRepository.getOneWithRelations(
      { id: userId },
      { usersToSkills: true },
    );

    if (user.isActive || !user.isVerified) {
      throw new BadRequestException(
        user.isActive ? errorMessages.onboardingAlreadyCompleted : errorMessages.emailNotVerified,
      );
    }

    const usersToSkills = await this.softSkillsRepository.findSoftSkillsByIds(
      request?.fourthStep?.softSkills ?? [],
    );
    const data = request.getData(user.id, usersToSkills);

    const save = await this.usersRepository.save(this.usersRepository.merge(user, data));

    const result = await this.usersRepository.getOneWithRelations(
      { id: userId },
      {
        usersToSkills: { softSkill: true },
      },
    );

    const response = new OnboardingResponse(result);

    if (response.complete) {
      await this.usersRepository.save(
        this.usersRepository.merge(save, {
          status: UserStatus.Active,
        }),
      );
    }

    return response;
  }

  async getOnboarding(userId: string) {
    const user = await this.usersRepository.getOneWithSkills(userId);
    return new OnboardingResponse(user);
  }
}
