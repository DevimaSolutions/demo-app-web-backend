import fs from 'fs';
import { extname, join } from 'path';

import { Bucket, Storage } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { ConfigService } from '@nestjs/config';

import { GoogleCloudService } from '@/features/google-cloud';

@Injectable()
export class GoogleStorageService {
  private storage: Storage;
  private bucket: Bucket;

  constructor(
    protected readonly config: ConfigService,
    private readonly googleCloudService: GoogleCloudService,
  ) {
    const { bucket, serviceAccountConfigs } = this.config.get('google');

    if (fs.existsSync(serviceAccountConfigs)) {
      this.storage = new Storage({ keyFilename: serviceAccountConfigs });
      this.bucket = this.storage.bucket(bucket);
    } else {
      this.googleCloudService.accessGoogleCloudSecretFile(serviceAccountConfigs).then((data) => {
        this.storage = new Storage({ keyFilename: data });
        this.bucket = this.storage.bucket(bucket);
      });
    }
  }

  async upload(file: Express.Multer.File, destination = '') {
    const filename = this.getFilename(file);
    const gcFile = this.bucket.file(join(destination, filename));

    return new Promise<Express.Multer.File>((resolve, reject) => {
      gcFile
        .createWriteStream({
          predefinedAcl: 'publicRead',
        })
        .on('error', (error) => reject(error))
        .on('finish', () =>
          resolve({
            ...file,
            path: `https://storage.googleapis.com/${this.config.get('google.bucket')}/${join(
              destination,
              filename,
            )}`,
            filename: filename,
          }),
        )
        .end(file.buffer);
    });
  }

  async remove(name: string) {
    const file = this.bucket.file(name);

    const exist = (await file.exists()).some((item) => item);

    if (exist) {
      await file.delete();
    }
  }

  private getFilename(file: Express.Multer.File) {
    const name = file.originalname.split('.')[0];
    const ext = extname(file.originalname);
    return `${name}-${randomStringGenerator()}${ext}`;
  }
}
