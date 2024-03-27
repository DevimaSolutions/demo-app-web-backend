import * as Joi from 'joi';

import { LearningPace } from '@/features/profiles';
import { OnboardingThirdStepRequest } from '@/features/profiles/dto/requests/onboarding-third-step.request';
export const onboardingThirdStepSchema = Joi.object<OnboardingThirdStepRequest>({
  learningPace: Joi.string()
    .valid(...Object.values(LearningPace))
    .required(),
});
