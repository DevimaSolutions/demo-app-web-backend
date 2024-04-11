import * as Joi from 'joi';

import { OrderDirection, paginationQuerySchema } from '@/features/common';
import { ProfileFriendsPaginateQuery, QueryFriendsOrderBy } from '@/features/profiles';

export const profileFriendsPaginationQuerySchema = paginationQuerySchema.concat(
  Joi.object<ProfileFriendsPaginateQuery>({
    search: Joi.string().trim().default('').lowercase().optional(),
    orderDirection: Joi.string()
      .valid(...Object.values(OrderDirection))
      .default(OrderDirection.Desc)
      .optional(),
    orderBy: Joi.alternatives()
      .try(
        Joi.string()
          .valid(...Object.values(QueryFriendsOrderBy))
          .optional()
          .default([QueryFriendsOrderBy.Level, QueryFriendsOrderBy.Experience]),
        Joi.array()
          .items(Joi.string().valid(...Object.values(QueryFriendsOrderBy)))
          .default([QueryFriendsOrderBy.Level, QueryFriendsOrderBy.Experience])
          .optional(),
      )
      .default([QueryFriendsOrderBy.Level, QueryFriendsOrderBy.Experience]),
  }),
);
