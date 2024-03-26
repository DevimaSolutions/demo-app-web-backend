import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './entities';
import { UsersService, HasherService } from './services';
import { UsersController } from './users.controller';

import { UserSocials } from '@/features/users/entities/user-socials.entity';
import { UsersToFriends } from '@/features/users/entities/users-to-friend.entity';
import { UsersToSkills } from '@/features/users/entities/users-to-skills.entity';
import { UsersVerificationToken } from '@/features/users/entities/users-verification-token.entity';
import { UsersRepository, UsersToFriendsRepository } from '@/features/users/repositoies';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      UsersVerificationToken,
      UsersToSkills,
      UsersToFriends,
      UserSocials,
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, UsersToFriendsRepository, HasherService],
  exports: [UsersService, UsersRepository, UsersToFriendsRepository, HasherService],
})
export class UsersModule {}
