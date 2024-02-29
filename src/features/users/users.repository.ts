import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { User } from './entities/user.entity';

import { BaseRepository } from '@/features/common/base.repository';

@Injectable()
export class UsersRepository extends BaseRepository<User> {
  constructor(dataSource: DataSource) {
    super(User, dataSource);
  }

  async getOne(id: string) {
    const entity = await this.findOneBy({ id });

    if (!entity) {
      throw new NotFoundException();
    }

    return entity;
  }
}
