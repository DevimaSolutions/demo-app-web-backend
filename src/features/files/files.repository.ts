import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';

import { BaseRepository } from '@/features/common/base.repository';
import { FileEntity } from '@/features/files/entities';

@Injectable()
export class FilesRepository extends BaseRepository<FileEntity> {
  constructor(dataSource: DataSource) {
    super(FileEntity, dataSource);
  }

  async getOneBy(where: FindOptionsWhere<FileEntity>) {
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
