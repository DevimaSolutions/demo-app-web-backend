import { BadRequestException, Injectable } from '@nestjs/common';
import admin from 'firebase-admin';

import { UsersService } from '@/features/users';

@Injectable()
export class FirebaseService {
  constructor(private readonly usersService: UsersService) {}

  public initializeFirebaseAdmin() {
    if (!admin.apps.length) {
      admin.initializeApp(
        process.env.NODE_ENV !== 'production'
          ? {
              // Do not recommeded. See here: https://firebase.google.com/docs/cloud-messaging/migrate-v1#linux-or-macos
              credential: admin.credential.cert('firebase-adminsdk.json'),
              databaseURL: 'https://shapergap-default-rtdb.firebaseio.com', // TODO: do i need this?
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
