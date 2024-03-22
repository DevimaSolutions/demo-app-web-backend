import * as Joi from 'joi';

import { paginationQuerySchema } from '@/features/common';
import { UserPaginateQuery } from '@/features/users';

export const profileFriendsPaginationQuerySchema = paginationQuerySchema.concat(
  Joi.object<UserPaginateQuery>({
    search: Joi.string().trim().default('').lowercase().optional(),
  }),
);
