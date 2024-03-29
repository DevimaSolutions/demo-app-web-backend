import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SoftSkillsAdminController, SoftSkillsController } from './controllers';
import { SoftSkill } from './entities';
import { SoftSkillsRepository } from './soft-skills.repository';
import { SoftSkillsService } from './soft-skills.service';

@Module({
  imports: [TypeOrmModule.forFeature([SoftSkill])],
  controllers: [SoftSkillsAdminController, SoftSkillsController],
  providers: [SoftSkillsService, SoftSkillsRepository],
  exports: [SoftSkillsService, SoftSkillsRepository],
})
export class SoftSkillsModule {}
