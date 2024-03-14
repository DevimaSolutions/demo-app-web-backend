import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FilesService, GoogleStorageService } from './services';

import { FileEntity } from '@/features/files/entities';
import { FilesRepository } from '@/features/files/files.repository';

@Module({
  imports: [TypeOrmModule.forFeature([FileEntity])],
  providers: [GoogleStorageService, FilesService, FilesRepository],
  exports: [GoogleStorageService, FilesService, FilesRepository],
})
export class FilesModule {}
