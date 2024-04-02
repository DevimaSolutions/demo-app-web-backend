import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';

import { BaseRepository } from '@/features/common/base.repository';
import { Subscription } from '@/features/subscriptions/entities/subscription.entity';
@Injectable()
export class SubscriptionsRepository extends BaseRepository<Subscription> {
  constructor(dataSource: DataSource) {
    super(Subscription, dataSource);
  }

  async getOneBy(where: FindOptionsWhere<Subscription>) {
    const entity = await this.findOneBy(where);

    if (!entity) {
      throw new NotFoundException();
    }

    return entity;
  }

  async getOne(id: string) {
    const entity = await this.findOneBy({ id });

    if (!entity) {
      throw new NotFoundException();
    }

    return entity;
  }
}
