import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { BaseRepository } from '@/features/common/base.repository';
import { UsersToFriends } from '@/features/users/entities/users-to-friend.entity';

@Injectable()
export class UsersToFriendsRepository extends BaseRepository<UsersToFriends> {
  constructor(dataSource: DataSource) {
    super(UsersToFriends, dataSource);
  }
}
