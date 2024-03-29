import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { SoftSkillsService } from '../soft-skills.service';

import { Authorized, UserStatus } from '@/features/auth';

@ApiTags('Soft skills')
@Controller('soft-skills')
export class SoftSkillsController {
  constructor(private readonly softSkillsService: SoftSkillsService) {}

  @Get()
  @Authorized(UserStatus.Pending, UserStatus.Active, UserStatus.Verified)
  @ApiOperation({
    summary: 'Get all soft skills',
  })
  index() {
    return this.softSkillsService.findAll();
  }
}
