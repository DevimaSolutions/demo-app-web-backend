import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FilesService, GoogleStorageService } from './services';

import { FileEntity } from '@/features/files/entities';
import { FilesRepository } from '@/features/files/files.repository';
import { GoogleCloudModule } from '@/features/google-cloud';

@Module({
  imports: [TypeOrmModule.forFeature([FileEntity]), GoogleCloudModule],
  providers: [GoogleStorageService, FilesService, FilesRepository],
  exports: [GoogleStorageService, FilesService, FilesRepository],
})
export class FilesModule {}
