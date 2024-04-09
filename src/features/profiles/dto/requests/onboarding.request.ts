import { ApiPropertyOptional } from '@nestjs/swagger';
import { DeepPartial } from 'typeorm';

import { OnboardingFirstStepRequest } from './onboarding-first-step.request';
import { OnboardingFourthStepRequest } from './onboarding-fourth-step.request';
import { OnboardingSecondStepRequest } from './onboarding-second-step.request';
import { OnboardingThirdStepRequest } from './onboarding-third-step.request';

import { User } from '@/features/users';

export class OnboardingRequest {
  @ApiPropertyOptional()
  firstStep?: OnboardingFirstStepRequest;
  @ApiPropertyOptional()
  secondStep?: OnboardingSecondStepRequest;
  @ApiPropertyOptional()
  thirdStep?: OnboardingThirdStepRequest;
  @ApiPropertyOptional()
  fourthStep?: OnboardingFourthStepRequest;

  public getData(userId: string, usersToSkills: { softSkillId: string }[]): DeepPartial<User> {
    const { name = null, ...rest } = this?.firstStep ?? {};

    const user = name ? { name, usersToSkills } : { usersToSkills };

    return {
      ...user,
      profile: {
        ...rest,
        ...(this?.secondStep || {}),
        ...(this?.thirdStep || {}),
        user: {
          id: userId,
        },
      },
    };
  }
}
