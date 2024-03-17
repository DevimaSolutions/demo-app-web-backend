import { ApiPropertyOptional } from '@nestjs/swagger';

import { OnboardingFirstStepRequest } from './onboarding-first-step.request';
import { OnboardingSecondStepRequest } from './onboarding-second-step.request';
import { OnboardingThirdStepRequest } from './onboarding-third-step.request';

export class OnboardingRequest {
  @ApiPropertyOptional()
  firstStep?: OnboardingFirstStepRequest;
  @ApiPropertyOptional()
  secondStep?: OnboardingSecondStepRequest;
  @ApiPropertyOptional()
  thirdStep?: OnboardingThirdStepRequest;
}
