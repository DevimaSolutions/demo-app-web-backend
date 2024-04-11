import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { FindOptionsRelations } from 'typeorm/find-options/FindOptionsRelations';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';

import { BaseRepository } from '@/features/common/base.repository';
import { Energy } from '@/features/energy/entities';
@Injectable()
export class EnergyRepository extends BaseRepository<Energy> {
  constructor(dataSource: DataSource) {
    super(Energy, dataSource);
  }

  async getOneBy(where: FindOptionsWhere<Energy>) {
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

  async getOneByWithRelations(
    where: FindOptionsWhere<Energy>,
    relations?: FindOptionsRelations<Energy>,
  ) {
    const entity = await this.findOne({ where, relations });

    if (!entity) {
      throw new NotFoundException();
    }

    return entity;
  }
}
