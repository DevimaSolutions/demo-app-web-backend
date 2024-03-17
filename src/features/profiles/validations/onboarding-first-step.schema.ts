import * as Joi from 'joi';

import { Gender } from '@/features/profiles';
import { OnboardingFirstStepRequest } from '@/features/profiles/dto/request/onboarding-first-step.request';
export const onboardingFirstStepSchema = Joi.object<OnboardingFirstStepRequest>({
  name: Joi.string().required(),
  age: Joi.number().required(),
  gender: Joi.string()
    .valid(...Object.values(Gender))
    .required(),
});
