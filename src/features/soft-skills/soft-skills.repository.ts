import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, In } from 'typeorm';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';

import { BaseRepository } from '@/features/common/base.repository';
import { SoftSkill } from '@/features/soft-skills/entities';

@Injectable()
export class SoftSkillsRepository extends BaseRepository<SoftSkill> {
  constructor(dataSource: DataSource) {
    super(SoftSkill, dataSource);
  }

  async getOneBy(where: FindOptionsWhere<SoftSkill>) {
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

  async findSoftSkillsByIds(ids: string[]) {
    if (ids.length) {
      return (await this.findBy({ id: In(ids) })).map((item) => ({
        softSkillId: item.id,
      }));
    }

    return [];
  }
}
