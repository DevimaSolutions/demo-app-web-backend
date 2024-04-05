import { Module } from '@nestjs/common';

import { FirebaseController } from './firebase.controller';
import { FirebaseService } from './firebase.service';

import { UsersModule } from '@/features/users';

@Module({
  imports: [UsersModule],
  controllers: [FirebaseController],
  providers: [FirebaseService],
  exports: [FirebaseService],
})
export class FirebaseModule {}
