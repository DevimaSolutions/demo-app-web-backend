import * as Joi from 'joi';

import { ProfileType } from '@/features/profiles';
import { OnboardingSecondStepRequest } from '@/features/profiles/dto/requests/onboarding-second-step.request';
export const onboardingSecondStepSchema = Joi.object<OnboardingSecondStepRequest>({
  profileType: Joi.string()
    .valid(...Object.values(ProfileType))
    .required(),
});
