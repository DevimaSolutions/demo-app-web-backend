import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import admin from 'firebase-admin';

import { UsersService } from '@/features/users';

@Injectable()
export class FirebaseService {
  constructor(
    private readonly usersService: UsersService,
    private readonly config: ConfigService,
  ) {}

  public initializeFirebaseAdmin() {
    if (!admin.apps.length) {
      admin.initializeApp(
        this.config.get('firebase.useCredentials')
          ? {
              credential: admin.credential.cert(
                this.config.get('firebase.credentialsFilePath') as string,
              ),
            }
          : undefined,
      );
    }
  }

  public async getCustomToken(userId: string) {
    const user = await this.usersService.findOne(userId);
    try {
      return await admin.auth().createCustomToken(user.id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
