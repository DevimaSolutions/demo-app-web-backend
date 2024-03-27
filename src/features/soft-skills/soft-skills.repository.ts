import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Raw, In, Not } from 'typeorm';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';

import { BaseRepository } from '@/features/common/base.repository';
import { ProfileSoftSkillsPaginateQuery } from '@/features/profiles';
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

  async existByName(name: string, excludeId: string | null = null) {
    return await this.exist({
      where: { name, ...(excludeId ? { id: Not(excludeId) } : {}) },
    });
  }

  async getPaginateSoftSkillsForUser(userId: string, query?: ProfileSoftSkillsPaginateQuery) {
    return this.paginate(
      { limit: query?.limit, page: query?.page },
      {
        where: {
          name: Raw((alias) => `LOWER(${alias}) LIKE LOWER(:search)`, {
            search: `%${query?.search ?? ''}%`,
          }),
          usersToSkills: { userId },
        },
        relations: { usersToSkills: true },
      },
    );
  }
}
