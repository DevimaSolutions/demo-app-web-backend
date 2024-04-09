import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';

import { OrderQuery } from '@/features/common/dto/queries/order.query';
import { QueryFriendsSort } from '@/features/profiles/enums/query-friends-sort.enum';
import { UserPaginateQuery } from '@/features/users';

export class ProfileFriendsPaginateQuery extends IntersectionType(UserPaginateQuery, OrderQuery) {
  @ApiPropertyOptional({
    type: 'array',
    enum: QueryFriendsSort,
    isArray: true,
    default: [QueryFriendsSort.Level, QueryFriendsSort.Experience],
  })
  sort: QueryFriendsSort[];

  get orderBy() {
    return Array.isArray(this.sort)
      ? this.sort.reduce((acc, key) => ({ ...acc, [this.mapKey(key)]: this.order }), {})
      : { [this.mapKey(this.sort)]: this.order };
  }

  mapKey(key: QueryFriendsSort) {
    const user = [QueryFriendsSort.Name, QueryFriendsSort.Username];
    return user.includes(key) ? `u.${key}` : `progress.${key}`;
  }
}
