import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';

import { Profile } from '@/features/profiles/entities';
import { UsersRepository } from '@/features/users';

@Module({
  imports: [TypeOrmModule.forFeature([Profile])],
  controllers: [ProfilesController],
  providers: [ProfilesService, UsersRepository],
  exports: [ProfilesService],
})
export class ProfilesModule {}
