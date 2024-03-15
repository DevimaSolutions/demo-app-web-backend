import { extname } from 'path';

import { Bucket, Storage } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStorageService {
  private storage: Storage;
  private bucket: Bucket;
  constructor(protected readonly config: ConfigService) {
    const { bucket, projectId, privateKey, clientEmail } = this.config.get('google');

    this.storage = new Storage({
      projectId,
      credentials: { client_email: clientEmail, private_key: privateKey },
    });

    this.bucket = this.storage.bucket(bucket);
  }

  async upload(file: Express.Multer.File) {
    const filename = this.getFilename(file);
    const gcFile = this.bucket.file(filename);

    return new Promise<Express.Multer.File>((resolve, reject) => {
      gcFile
        .createWriteStream({
          predefinedAcl: 'publicRead',
        })
        .on('error', (error) => reject(error))
        .on('finish', () =>
          resolve({
            ...file,
            path: `https://storage.googleapis.com/${this.config.get('google.bucket')}/${filename}`,
            filename: filename,
          }),
        )
        .end(file.buffer);
    });
  }

  private getFilename(file: Express.Multer.File) {
    const name = file.originalname.split('.')[0];
    const ext = extname(file.originalname);
    return `${name}-${randomStringGenerator()}${ext}`;
  }
}
