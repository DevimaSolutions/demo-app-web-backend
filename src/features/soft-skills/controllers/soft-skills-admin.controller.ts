import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

import { SoftSkillsService } from '../soft-skills.service';

import { Authorized, UserRole } from '@/features/auth';
import { CreateSoftSkillRequest } from '@/features/soft-skills/dto';
import { createSoftSkillSchema } from '@/features/soft-skills/validations';
import { JoiValidationPipe } from '@/pipes';

@ApiTags('Admin')
@Controller('admin/soft-skills')
export class SoftSkillsAdminController {
  constructor(private readonly softSkillsService: SoftSkillsService) {}

  @Get()
  @Authorized(UserRole.Admin)
  @ApiOperation({
    description:
      '### You will be able to use this operation only when the user is in the *role  admin*',
    summary: 'Get all soft skills',
  })
  index() {
    return this.softSkillsService.findAll();
  }

  @Get(':id')
  @Authorized(UserRole.Admin)
  @ApiParam({ name: 'id', type: 'string' })
  @ApiOperation({
    description:
      '### You will be able to use this operation only when the user is in the *role  admin*',
    summary: 'Get a specific soft skill by id',
  })
  show(@Param('id', ParseUUIDPipe) id: string) {
    return this.softSkillsService.getOne(id);
  }

  @Post()
  @Authorized(UserRole.Admin)
  @ApiOperation({
    description:
      '### You will be able to use this operation only when the user is in the *role  admin*',
    summary: 'Create a new soft skill',
  })
  create(@Body(new JoiValidationPipe(createSoftSkillSchema)) request: CreateSoftSkillRequest) {
    return this.softSkillsService.create(request);
  }

  @Patch(':id')
  @Authorized(UserRole.Admin)
  @ApiParam({ name: 'id', type: 'string' })
  @ApiOperation({
    description:
      '### You will be able to use this operation only when the user is in the *role  admin*',
    summary: 'Update a specific soft skill by id',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new JoiValidationPipe(createSoftSkillSchema)) request: CreateSoftSkillRequest,
  ) {
    return this.softSkillsService.update(id, request);
  }

  @Delete(':id')
  @Authorized(UserRole.Admin)
  @ApiParam({ name: 'id', type: 'string' })
  @ApiOperation({
    description:
      '### You will be able to use this operation only when the user is in the *role  admin*',
    summary: 'Remove a specific soft skill by id',
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.softSkillsService.remove(id);
  }
}
