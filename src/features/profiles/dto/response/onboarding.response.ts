import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { OnboardingFirstStepResponse } from './onboarding-first-step.response';
import { OnboardingFourthStepResponse } from './onboarding-fourth-step.response';
import { OnboardingSecondStepResponse } from './onboarding-second-step.response';
import { OnboardingThirdStepResponse } from './onboarding-third-step.response';

import { User } from '@/features/users';

export class OnboardingResponse {
  constructor(user: User) {
    this.firstStep = new OnboardingFirstStepResponse(user);
    this.secondStep = new OnboardingSecondStepResponse(user.profile);
    this.thirdStep = new OnboardingThirdStepResponse(user.profile);
    this.fourthStep = new OnboardingFourthStepResponse(user);
  }

  @ApiProperty()
  firstStep: OnboardingFirstStepResponse;
  @ApiProperty()
  secondStep: OnboardingSecondStepResponse;
  @ApiProperty()
  thirdStep: OnboardingThirdStepResponse;
  @ApiProperty()
  fourthStep: OnboardingFourthStepResponse;

  @ApiProperty({ type: 'boolean' })
  @Expose()
  get complete(): boolean {
    return Object.values(this).reduce((acc, item) => acc && item.complete, true);
  }

  @ApiProperty({ type: 'string' })
  @Expose()
  get currentStep(): string {
    const index = Object.values(this).findIndex((item) => !item.complete);
    const keys = Object.keys(this);
    return index === -1 ? keys[keys.length - 1] : keys[index];
  }
}
