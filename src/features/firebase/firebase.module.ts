import { Module } from '@nestjs/common';

import { FirebaseService } from './firebase.service';

import { UsersModule } from '@/features/users';

@Module({
  imports: [UsersModule],
  providers: [FirebaseService],
  exports: [FirebaseService],
})
export class FirebaseModule {}
