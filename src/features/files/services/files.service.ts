import { Injectable } from '@nestjs/common';

import { FileResponse } from '@/features/files/dto';
import { FilesRepository } from '@/features/files/files.repository';
import { GoogleStorageService } from '@/features/files/services';

@Injectable()
export class FilesService {
  constructor(
    protected readonly googleStorageService: GoogleStorageService,
    private readonly repository: FilesRepository,
  ) {}

  async create(file: Express.Multer.File) {
    const gcFile = await this.googleStorageService.upload(file);

    const entity = await this.repository.save({
      name: gcFile.filename,
      size: gcFile.size,
      path: gcFile.path,
      mimetype: gcFile.mimetype,
    });
    return new FileResponse(entity);
  }

  async getFileContentStream(name: string) {
    const file = await this.repository.getOneBy({ name });
    return this.googleStorageService.getFileContentStream(file.name);
  }
}
