import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  ProfilesService,
  ProfileFriendsService,
  ProfileSoftSkillsService,
  ProfileOnboardingService,
} from './services';

import { FilesModule } from '@/features/files';
import {
  ProfilesController,
  ProfilesOnboardingController,
  ProfilesFriendsController,
  ProfilesSoftSkillsController,
} from '@/features/profiles/controllers';
import { Profile } from '@/features/profiles/entities';
import { SoftSkillsRepository } from '@/features/soft-skills';
import { UsersRepository, UsersToFriendsRepository } from '@/features/users/repositoies';

@Module({
  imports: [TypeOrmModule.forFeature([Profile]), FilesModule],
  controllers: [
    ProfilesController,
    ProfilesFriendsController,
    ProfilesSoftSkillsController,
    ProfilesOnboardingController,
  ],
  providers: [
    ProfilesService,
    ProfileFriendsService,
    ProfileSoftSkillsService,
    ProfileOnboardingService,
    UsersRepository,
    UsersToFriendsRepository,
    SoftSkillsRepository,
  ],
  exports: [ProfilesService, ProfileFriendsService],
})
export class ProfilesModule {}
