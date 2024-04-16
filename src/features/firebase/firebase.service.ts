import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import admin from 'firebase-admin';

import { errorMessages } from '@/features/common';
import { UsersService } from '@/features/users';

@Injectable()
export class FirebaseService {
  constructor(
    private readonly usersService: UsersService,
    private readonly config: ConfigService,
  ) {}

  public initializeFirebaseAdmin() {
    // TODO: add logger for unsuccessful initialization
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(
          this.config.get<string>('firebase.credentialsFilePath', ''),
        ),
        databaseURL: this.config.get<string>('firebase.databaseURL'),
      });
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
