import { Injectable, NotFoundException } from '@nestjs/common';
import { Brackets, DataSource, MoreThanOrEqual, Not } from 'typeorm';
import { FindOptionsRelations } from 'typeorm/find-options/FindOptionsRelations';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';

import { UserStatus } from '@/features/auth';
import { BaseRepository } from '@/features/common/base.repository';
import { UserFriendResponse, UserPaginateQuery, UserResponse } from '@/features/users/dto';
import { User } from '@/features/users/entities/user.entity';
import { UsersToFriends } from '@/features/users/entities/users-to-friend.entity';
import { VerificationTokenType } from '@/features/users/enums/verification-token-type.enum';

@Injectable()
export class UsersRepository extends BaseRepository<User> {
  constructor(dataSource: DataSource) {
    super(User, dataSource);
  }

  async getOneBy(where: FindOptionsWhere<User>) {
    const entity = await this.findOneBy(where);

    if (!entity) {
      throw new NotFoundException();
    }

    return entity;
  }

  async getByEmail(email: string) {
    return await this.getOneBy({ email });
  }

  async getOne(id: string) {
    const entity = await this.findOneBy({ id });

    if (!entity) {
      throw new NotFoundException();
    }

    return entity;
  }

  async getOneWithRelations(
    where: FindOptionsWhere<User>[] | FindOptionsWhere<User>,
    relations?: FindOptionsRelations<User>,
  ) {
    const entity = await this.findOne({ where, relations });

    if (!entity) {
      throw new NotFoundException();
    }

    return entity;
  }

  async getOneWithSkills(id: string) {
    return await this.getOneWithRelations(
      { id },
      {
        usersToSkills: { softSkill: true },
      },
    );
  }

  async getUserByEmailVerificationCode(id: string, code: string) {
    return this.getOneWithRelations(
      {
        id,
        status: UserStatus.Pending,
        tokens: {
          type: VerificationTokenType.VerifyEmail,
          token: code,
          expireAt: MoreThanOrEqual(new Date()),
        },
      },
      {
        tokens: true,
      },
    );
  }

  async verifyEmail(user: User) {
    await this.update(user.id, {
      emailVerified: new Date(),
      status: UserStatus.Verified,
    });
    for (const token of user.tokens) {
      await token.remove();
    }
  }

  async resetPassword(user: User, password: string) {
    await this.update(user.id, {
      password,
    });
    for (const token of user.tokens) {
      await token.remove();
    }
  }

  async getOneWithActiveSubscription(id: string) {
    return this.createQueryBuilder('u')
      .leftJoinAndSelect('u.profile', 'profile')
      .leftJoinAndSelect('profile.profileImage', 'profileImage')
      .leftJoinAndSelect('u.progress', 'progress')
      .leftJoinAndSelect('u.subscriptions', 'subscriptions', 'end_at >= now()')
      .where({ id })
      .getOne();
  }

  async findActiveUserByEmail(email: string, relations?: FindOptionsRelations<User>) {
    return this.findOne({
      where: { email, status: Not(UserStatus.Blocked) },
      relations,
    });
  }

  async findActiveUser(id: string) {
    return this.findOne({
      where: {
        id,
        status: UserStatus.Active,
      },
    });
  }

  async findAllPaginate({ page, limit, search }: UserPaginateQuery) {
    const builder = this.createQueryBuilder('u')
      .leftJoinAndSelect('u.profile', 'profile')
      .leftJoinAndSelect('profile.profileImage', 'profileImage')
      .leftJoinAndSelect('u.progress', 'progress')
      .andWhere(
        new Brackets((qb) => {
          qb.where("CONCAT(LOWER(name_first), ' ', LOWER(name_last)) LIKE :search", {
            search: `%${search}%`,
          })
            .orWhere('LOWER(email) LIKE :search', { search: `%${search}%` })
            .orWhere('LOWER(nickname) LIKE :search', { search: `%${search}%` });
        }),
      );

    return this.paginateQueryBuilder(builder, {
      page,
      limit,
      transformer: UserResponse,
    });
  }

  async findAllWithFriendshipsAndPagination(
    { page, limit, search }: UserPaginateQuery,
    userId: string,
  ) {
    const builder = this.createQueryBuilder('u')
      .leftJoinAndSelect('u.profile', 'profile')
      .leftJoinAndSelect('profile.profileImage', 'profileImage')
      .leftJoinAndSelect('u.progress', 'progress')
      .leftJoinAndSelect('u.usersToFriends', 'usersToFriends', 'friend_id = :friendId', {
        friendId: userId,
      })
      .where((qb) => {
        const subQuery = qb
          .subQuery()
          .select('utf.friend_id')
          .from(UsersToFriends, 'utf')
          .where('utf.user_id = :userId', { userId })
          .where('utf.confirmed = true')
          .getQuery();
        return 'u.id NOT IN ' + subQuery;
      })
      .andWhere({ status: UserStatus.Active })
      .andWhere(
        new Brackets((qb) => {
          qb.where("CONCAT(LOWER(name_first), ' ', LOWER(name_last)) LIKE :search", {
            search: `%${search}%`,
          })
            .orWhere('LOWER(email) LIKE :search', { search: `%${search}%` })
            .orWhere('LOWER(nickname) LIKE :search', { search: `%${search}%` });
        }),
      );

    return this.paginateQueryBuilder(builder, {
      page,
      limit,
      transformer: UserFriendResponse,
    });
  }

  async findAllFriendsPaginate(userId: string, { page, limit, search }: UserPaginateQuery) {
    const builder = this.createQueryBuilder('u')
      .leftJoinAndSelect('u.profile', 'profile')
      .leftJoinAndSelect('profile.profileImage', 'profileImage')
      .leftJoinAndSelect('u.progress', 'progress')
      .leftJoinAndSelect('u.usersToFriends', 'usersToFriends', 'friend_id = :friendId', {
        friendId: userId,
      })
      .where((qb) => {
        const subQuery = qb
          .subQuery()
          .select('utf.friend_id')
          .from(UsersToFriends, 'utf')
          .where('utf.user_id = :userId', { userId })
          .andWhere('utf.confirmed = true')
          .getQuery();
        return 'u.id IN ' + subQuery;
      })
      .andWhere(
        new Brackets((qb) => {
          qb.where({ status: UserStatus.Active });
        }),
      )
      .andWhere(
        new Brackets((qb) => {
          qb.where("CONCAT(LOWER(u.name_first), ' ', LOWER(u.name_last)) LIKE :search", {
            search: `%${search}%`,
          })
            .orWhere('LOWER(u.email) LIKE :search', {
              search: `%${search}%`,
            })
            .orWhere('LOWER(u.nickname) LIKE :search', {
              search: `%${search}%`,
            });
        }),
      );

    return this.paginateQueryBuilder(builder, {
      page,
      limit,
      transformer: UserFriendResponse,
    });
  }

  async existByEmail(email: string, excludeId: string | null = null) {
    return await this.exist({
      where: { email, ...(excludeId ? { id: Not(excludeId) } : {}) },
    });
  }

  async existByNickname(nickname: string, excludeId: string | null = null) {
    return await this.exist({
      where: { nickname, ...(excludeId ? { id: Not(excludeId) } : {}) },
    });
  }
}
