import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, In, MoreThanOrEqual, Not, Brackets } from 'typeorm';
import { FindOptionsRelations } from 'typeorm/find-options/FindOptionsRelations';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';

import { User } from './entities/user.entity';

import { UserStatus } from '@/features/auth';
import { BaseRepository } from '@/features/common/base.repository';
import { UserPaginateQuery, UserResponse } from '@/features/users/dto';

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

  async getOneWithRelations(id: string, relations?: FindOptionsRelations<User>) {
    const entity = await this.findOne({ where: { id }, relations });

    if (!entity) {
      throw new NotFoundException();
    }

    return entity;
  }

  async getUserByEmailVerificationCode(id: string, code: string) {
    return this.getOneBy({
      id,
      verifyEmailCode: code,
      verifyCodeExpireAt: MoreThanOrEqual(new Date()),
    });
  }

  async verifyEmail(id: string) {
    await this.update(id, {
      emailVerified: new Date(),
      verifyCodeSubmittedAt: null,
      verifyEmailCode: null,
      verifyCodeExpireAt: null,
    });
  }

  async findActiveUserByEmail(email: string) {
    return this.findOneBy({ email, status: In([UserStatus.Active, UserStatus.Pending]) });
  }

  async findAllPaginate({ page, limit, search }: UserPaginateQuery, active = false) {
    const builder = this.createQueryBuilder('u')
      .leftJoinAndSelect('u.profile', 'profile')
      .leftJoinAndSelect('profile.profileImage', 'profileImage')
      .leftJoinAndSelect('u.usersToSkills', 'usersToSkills')
      .leftJoinAndSelect('usersToSkills.softSkill', 'softSkill')
      .andWhere(
        new Brackets((qb) => {
          qb.where("CONCAT(LOWER(name_first), ' ', LOWER(name_last)) LIKE :search", {
            search: `%${search}%`,
          }).orWhere('LOWER(email) LIKE :search', { search: `%${search}%` });
        }),
      );

    if (active) {
      builder.andWhere(
        new Brackets((qb) => {
          qb.where('email_verified IS NOT NULL').andWhere('profile.is_onboarding_completed = true');
        }),
      );
    }

    return this.paginateQueryBuilder(builder, {
      page,
      limit,
      transformer: UserResponse,
    });
  }

  async existByEmail(email: string, excludeId: string | null = null) {
    return await this.exist({
      where: { email, ...(excludeId ? { id: Not(excludeId) } : {}) },
    });
  }
}
