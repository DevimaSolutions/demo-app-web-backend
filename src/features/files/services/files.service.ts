import { Injectable } from '@nestjs/common';

import { FileEntity } from '@/features/files';
import { FileResponse } from '@/features/files/dto';
import { FilesRepository } from '@/features/files/files.repository';
import { GoogleStorageService } from '@/features/files/services';

@Injectable()
export class FilesService {
  constructor(
    protected readonly googleStorageService: GoogleStorageService,
    private readonly repository: FilesRepository,
  ) {}

  async create(file: Express.Multer.File, destination = '') {
    const gcFile = await this.googleStorageService.upload(file, destination);

    const entity = await this.repository.save({
      name: gcFile.filename,
      size: gcFile.size,
      path: gcFile.path,
      mimetype: gcFile.mimetype,
    });
    return new FileResponse(entity);
  }

  async remove(file: FileEntity) {
    await this.googleStorageService.remove(file.name);
    await this.repository.delete(file.id);
  }
}
