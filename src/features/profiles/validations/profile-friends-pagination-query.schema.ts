import * as Joi from 'joi';

import { paginationQuerySchema } from '@/features/common';
import { ProfileFriendsPaginateQuery } from '@/features/profiles';

export const profileFriendsPaginationQuerySchema = paginationQuerySchema.concat(
  Joi.object<ProfileFriendsPaginateQuery>({
    search: Joi.string().trim().default('').lowercase().optional(),
  }),
);
