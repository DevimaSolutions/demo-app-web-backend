import * as Joi from 'joi';

import { onboardingFirstStepSchema } from './onboarding-first-step.schema';
import { onboardingFourthStepSchema } from './onboarding-fourth-step.schema';
import { onboardingSecondStepSchema } from './onboarding-second-step.schema';
import { onboardingThirdStepSchema } from './onboarding-third-step.schema';

import { OnboardingRequest } from '@/features/profiles/dto';
export const onboardingProfileSchema = Joi.object<OnboardingRequest>({
  firstStep: onboardingFirstStepSchema,
  secondStep: onboardingSecondStepSchema,
  thirdStep: onboardingThirdStepSchema,
  fourthStep: onboardingFourthStepSchema,
});
