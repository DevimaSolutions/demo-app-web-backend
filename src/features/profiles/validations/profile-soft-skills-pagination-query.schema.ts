import * as Joi from 'joi';

import { paginationQuerySchema } from '@/features/common';
import { ProfileSoftSkillsPaginateQuery } from '@/features/profiles';

export const profileSoftSkillsPaginationQuerySchema = paginationQuerySchema.concat(
  Joi.object<ProfileSoftSkillsPaginateQuery>({
    search: Joi.string().trim().default('').lowercase().optional(),
  }),
);
