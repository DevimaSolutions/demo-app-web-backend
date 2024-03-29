import { ApiProperty } from '@nestjs/swagger';

import { UserResponse } from '@/features/users/dto/responses/user.response';
import { User } from '@/features/users/entities/user.entity';
import { UserFriendshipsType } from '@/features/users/enums/user-friendships.enum';

export class UserFriendResponse extends UserResponse {
  constructor(user: User) {
    super(user);
    if (user.usersToFriends?.length) {
      this.friendships = user.usersToFriends[0].confirmed
        ? UserFriendshipsType.Friend
        : UserFriendshipsType.Pending;
    }
  }

  @ApiProperty({ type: 'enum', enum: UserFriendshipsType })
  friendships: UserFriendshipsType = UserFriendshipsType.None;
}
