import * as Joi from 'joi';

import { Gender } from '@/features/profiles';
import { OnboardingFirstStepRequest } from '@/features/profiles/dto/request/onboarding-first-step.request';
export const onboardingFirstStepSchema = Joi.object<OnboardingFirstStepRequest>({
  name: Joi.string().max(255).required(),
  age: Joi.number().positive().min(0).max(150).required(),
  gender: Joi.string()
    .valid(...Object.values(Gender))
    .required(),
});
