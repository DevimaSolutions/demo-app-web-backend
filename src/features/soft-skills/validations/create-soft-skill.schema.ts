import * as Joi from 'joi';

import { CreateSoftSkillRequest } from '@/features/soft-skills';

export const createSoftSkillSchema = Joi.object<CreateSoftSkillRequest>({
  name: Joi.string().trim().required().max(255),
});
