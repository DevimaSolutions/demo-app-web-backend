import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

import { SoftSkillsService } from './soft-skills.service';

import { Authorized, UserRole } from '@/features/auth';
import { CreateSoftSkillRequest } from '@/features/soft-skills/dto';
import { createSoftSkillSchema } from '@/features/soft-skills/validations';
import { JoiValidationPipe } from '@/pipes';

@ApiTags('Soft skills')
@Controller('soft-skills')
export class SoftSkillsController {
  constructor(private readonly softSkillsService: SoftSkillsService) {}

  @Get()
  @Authorized()
  index() {
    return this.softSkillsService.findAll();
  }

  @Get(':id')
  @Authorized(UserRole.Admin)
  @ApiParam({ name: 'id', type: 'string' })
  @ApiOperation({ description: 'Roles required: Admin', deprecated: true })
  show(@Param('id', ParseUUIDPipe) id: string) {
    return this.softSkillsService.getOne(id);
  }

  @Post()
  @Authorized(UserRole.Admin)
  @ApiOperation({ description: 'Roles required: Admin', deprecated: true })
  create(@Body(new JoiValidationPipe(createSoftSkillSchema)) request: CreateSoftSkillRequest) {
    return this.softSkillsService.create(request);
  }

  @Patch(':id')
  @Authorized(UserRole.Admin)
  @ApiParam({ name: 'id', type: 'string' })
  @ApiOperation({ description: 'Roles required: Admin', deprecated: true })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new JoiValidationPipe(createSoftSkillSchema)) request: CreateSoftSkillRequest,
  ) {
    return this.softSkillsService.update(id, request);
  }

  @Delete(':id')
  @Authorized(UserRole.Admin)
  @ApiParam({ name: 'id', type: 'string' })
  @ApiOperation({ description: 'Roles required: Admin', deprecated: true })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.softSkillsService.remove(id);
  }
}
