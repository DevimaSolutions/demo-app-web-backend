import { Injectable, NotFoundException } from '@nestjs/common';
import { And, Equal, Not } from 'typeorm';

import { UserStatus } from '@/features/auth';
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
  async friendRequest(userId: string, friendId: string) {
    const friend = await this.usersRepository.findOneBy({
      id: And(Equal(friendId), Not(userId)),
      status: UserStatus.Active,
    });
    const exist = await this.usersToFriendsRepository.exist({ where: { userId, friendId } });

    if (friend && !exist) {
      await this.usersToFriendsRepository.useTransaction(async () => {
        await this.usersToFriendsRepository.save([
          new UsersToFriends({ userId, friendId, initiatorId: userId }),
          new UsersToFriends({ userId: friendId, friendId: userId, initiatorId: userId }),
        ]);
      });
    }

    // TODO: send notifications

    return { message: successMessages.success };
  }

  async acceptRequest(userId: string, friendId: string) {
    const friendships = await this.usersToFriendsRepository.findBy([
      {
        userId,
        initiatorId: And(Equal(friendId), Not(userId)),
        confirmed: false,
      },
      { friendId: userId, initiatorId: And(Equal(friendId), Not(userId)), confirmed: false },
    ]);

    if (friendships.length) {
      await this.usersToFriendsRepository.useTransaction(async () => {
        await this.usersToFriendsRepository.save(
          friendships.map((item) => ({ ...item, confirmed: true })),
        );
      });
    } else {
      throw new NotFoundException();
    }

    return { message: successMessages.success };
  }

  async declineRequest(userId: string, friendId: string) {
    const friendships = await this.usersToFriendsRepository.findBy([
      {
        userId,
        friendId,
        initiatorId: And(Equal(userId), Not(friendId)),
        confirmed: false,
      },
      {
        friendId: userId,
        userId: friendId,
        initiatorId: And(Equal(userId), Not(friendId)),
        confirmed: false,
      },
    ]);
    if (friendships.length) {
      await this.usersToFriendsRepository.useTransaction(async () => {
        await this.usersToFriendsRepository.remove(friendships);
      });
    } else {
      throw new NotFoundException();
    }

    return { message: successMessages.success };
  }

  async removeFriend(userId: string, friendId: string) {
    const friendships = await this.usersToFriendsRepository.findBy([
      { userId, friendId, confirmed: true },
      { friendId: userId, userId: friendId, confirmed: true },
    ]);

    if (friendships.length) {
      await this.usersToFriendsRepository.useTransaction(async () => {
        await this.usersToFriendsRepository.remove(friendships);
      });
    } else {
      throw new NotFoundException();
    }

    return { message: successMessages.success };
  }
}
