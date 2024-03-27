import { Injectable } from '@nestjs/common';

import { successMessages } from '@/features/common';
import { ProfileFriendsPaginateQuery } from '@/features/profiles';
import { User, UsersRepository, UsersToFriendsRepository } from '@/features/users';
import { UsersToFriends } from '@/features/users/entities/users-to-friend.entity';

@Injectable()
export class ProfileFriendsService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly usersToFriendsRepository: UsersToFriendsRepository,
  ) {}
  async getFriends(user: User, query: ProfileFriendsPaginateQuery) {
    return await this.usersRepository.findAllFriendsPaginate(user.id, query);
  }
  async addFriend(userId: string, friendId: string) {
    const friend = await this.usersRepository.findActiveUser(friendId);

    if (friend) {
      await new UsersToFriends({ userId, friendId }).save();
      await new UsersToFriends({ userId: friendId, friendId: userId }).save();
    }

    return { message: successMessages.success };
  }

  async removeFriend(userId: string, friendId: string) {
    const promises = [
      await this.usersToFriendsRepository.findOneBy({ userId, friendId }),
      await this.usersToFriendsRepository.findOneBy({ userId: friendId, friendId: userId }),
    ];

    const friends = await Promise.all(promises);

    for (const friend of friends) {
      if (friend) {
        await friend.remove();
      }
    }

    return { message: successMessages.success };
  }
}
