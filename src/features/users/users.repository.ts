import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';

import { User } from './entities/user.entity';

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
}
