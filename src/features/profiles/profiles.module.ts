import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';

import { FilesModule } from '@/features/files';
import { Profile } from '@/features/profiles/entities';
import { SoftSkillsRepository } from '@/features/soft-skills';
import { UsersRepository, UsersToFriendsRepository } from '@/features/users/repositoies';

@Module({
  imports: [TypeOrmModule.forFeature([Profile]), FilesModule],
  controllers: [ProfilesController],
  providers: [ProfilesService, UsersRepository, UsersToFriendsRepository, SoftSkillsRepository],
  exports: [ProfilesService],
})
export class ProfilesModule {}
