import * as Joi from 'joi';

import { Order, paginationQuerySchema } from '@/features/common';
import { ProfileFriendsPaginateQuery, QueryFriendsSort } from '@/features/profiles';

export const profileFriendsPaginationQuerySchema = paginationQuerySchema.concat(
  Joi.object<ProfileFriendsPaginateQuery>({
    search: Joi.string().trim().default('').lowercase().optional(),
    order: Joi.string()
      .valid(...Object.values(Order))
      .default(Order.Desc)
      .optional(),
    sort: Joi.alternatives().try(
      Joi.string()
        .valid(...Object.values(QueryFriendsSort))
        .optional()
        .default([QueryFriendsSort.Level, QueryFriendsSort.Experience]),
      Joi.array()
        .items(Joi.string().valid(...Object.values(QueryFriendsSort)))
        .default([QueryFriendsSort.Level, QueryFriendsSort.Experience])
        .optional(),
    ),
  }),
);
