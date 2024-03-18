import * as Joi from 'joi';

import { OnboardingFourthStepRequest } from '@/features/profiles/dto/request/onboarding-fourth-step.request';
export const onboardingFourthStepSchema = Joi.object<OnboardingFourthStepRequest>({
  softSkills: Joi.array()
    .items(Joi.string().uuid({ version: 'uuidv4' }))
    .required(),
});
