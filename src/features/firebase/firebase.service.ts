import fs from 'fs';

import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import admin from 'firebase-admin';

import { errorMessages } from '@/features/common';
import { GoogleCloudService } from '@/features/google-cloud';
import { UsersService } from '@/features/users';

@Injectable()
export class FirebaseService {
  private credentialsConfigs: string;
  private databaseURL: string;

  constructor(
    private readonly usersService: UsersService,
    private readonly config: ConfigService,
    private readonly googleCloudService: GoogleCloudService,
  ) {
    this.credentialsConfigs = this.config.get<string>('firebase.credentialsConfigs', '');
    this.databaseURL = this.config.get<string>('firebase.databaseURL', '');
  }

  // TODO: add logger for unsuccessful initialization
  public async initializeFirebaseAdmin() {
    if (!admin.apps.length) {
      const cert = fs.existsSync(this.credentialsConfigs)
        ? this.credentialsConfigs
        : await this.googleCloudService.accessGoogleCloudSecretFile(this.credentialsConfigs);

      if (cert) {
        admin.initializeApp({
          credential: admin.credential.cert(cert),
          databaseURL: this.databaseURL,
        });
      } else {
        throw new BadRequestException('Could not initialize Firebase Admin.');
      }
    }
  }

  public async getCustomToken(userId: string) {
    const user = await this.usersService.findOne(userId);
    try {
      return await admin.auth().createCustomToken(user.id);
    } catch (error) {
      throw new BadRequestException(errorMessages.firebaseTokenGenerateError);
    }
  }
}
