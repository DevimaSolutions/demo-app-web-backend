import { Module } from '@nestjs/common';

import { FirebaseService } from './firebase.service';

import { GoogleCloudModule } from '@/features/google-cloud';
import { UsersModule } from '@/features/users';

@Module({
  imports: [UsersModule, GoogleCloudModule],
  providers: [FirebaseService],
  exports: [FirebaseService],
})
export class FirebaseModule {}
