import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';

import { OrderQuery } from '@/features/common/dto/queries/order.query';
import { QueryFriendsOrderBy } from '@/features/profiles/enums/query-friends-order-by.enum';
import { UserPaginateQuery } from '@/features/users/dto/queries/user-paginate.query';

export class ProfileFriendsPaginateQuery extends IntersectionType(UserPaginateQuery, OrderQuery) {
  @ApiPropertyOptional({
    type: 'array',
    enum: QueryFriendsOrderBy,
    isArray: true,
    default: [QueryFriendsOrderBy.Level, QueryFriendsOrderBy.Experience],
  })
  orderBy: QueryFriendsOrderBy[];

  get orderedBy() {
    return Array.isArray(this.orderBy)
      ? this.orderBy.reduce((acc, key) => ({ ...acc, [this.mapKey(key)]: this.orderDirection }), {})
      : { [this.mapKey(this.orderBy)]: this.orderDirection };
  }

  mapKey(key: QueryFriendsOrderBy) {
    const user = [QueryFriendsOrderBy.Name, QueryFriendsOrderBy.Username];
    return user.includes(key) ? `u.${key}` : `progress.${key}`;
  }
}
