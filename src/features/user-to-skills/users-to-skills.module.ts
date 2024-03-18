import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersToSkills } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([UsersToSkills])],
})
export class UsersToSkillsModule {}
