import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './entities';
import { UsersService, HasherService } from './services';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';

import { UsersToFriends } from '@/features/users/entities/users-to-friend.entity';
import { UsersToSkills } from '@/features/users/entities/users-to-skills.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UsersToSkills, UsersToFriends])],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, HasherService],
  exports: [UsersService, UsersRepository, HasherService],
})
export class UsersModule {}
