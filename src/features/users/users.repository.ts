import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, In, MoreThanOrEqual } from 'typeorm';
import { FindOptionsRelations } from 'typeorm/find-options/FindOptionsRelations';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';

import { User } from './entities/user.entity';

import { UserStatus } from '@/features/auth';
import { BaseRepository } from '@/features/common/base.repository';

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
}
