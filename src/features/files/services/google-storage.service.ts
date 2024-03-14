import { extname } from 'path';

import { Bucket, Storage } from '@google-cloud/storage';
import { Injectable, NotFoundException } from '@nestjs/common';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStorageService {
  private storage: Storage;
  private bucket: Bucket;
  constructor(protected readonly config: ConfigService) {
    const { projectId, keyFilename, bucket } = this.config.get('google');

    this.storage = new Storage({ projectId, keyFilename });

    this.bucket = this.storage.bucket(bucket);
  }

  async upload(file: Express.Multer.File) {
    const filename = this.getFilename(file);
    const gcFile = this.bucket.file(filename);

    return new Promise<Express.Multer.File>((resolve, reject) => {
      gcFile
        .createWriteStream({
          predefinedAcl: 'private',
        })
        .on('error', (error) => reject(error))
        .on('finish', () =>
          resolve({
            ...file,
            path: `https://${this.config.get('google.bucket')}.storage.googleapis.com/${filename}`,
            filename: filename,
          }),
        )
        .end(file.buffer);
    });
  }

  async getFileContentStream(name: string) {
    const gcFile = this.bucket.file(name);

    const exist = (await gcFile.exists()).some((item) => item);

    if (!exist) {
      throw new NotFoundException();
    }

    return gcFile.createReadStream();
  }

  private getFilename(file: Express.Multer.File) {
    const name = file.originalname.split('.')[0];
    const ext = extname(file.originalname);
    return `${name}-${randomStringGenerator()}${ext}`;
  }
}
