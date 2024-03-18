import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SoftSkill } from './entities';
import { SoftSkillsController } from './soft-skills.controller';
import { SoftSkillsRepository } from './soft-skills.repository';
import { SoftSkillsService } from './soft-skills.service';

@Module({
  imports: [TypeOrmModule.forFeature([SoftSkill])],
  controllers: [SoftSkillsController],
  providers: [SoftSkillsService, SoftSkillsRepository],
  exports: [SoftSkillsService, SoftSkillsRepository],
})
export class SoftSkillsModule {}
