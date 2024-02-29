import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';

import { CreateUserRequest, UpdateUserRequest } from './dto';
import { UsersService } from './users.service';

import { Authorized, UserRole } from '@/features/auth';
import { updateUserSchema, createUserSchema } from '@/features/users/validations';
import { JoiValidationPipe } from '@/pipes';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Authorized(UserRole.Admin)
  create(@Body(new JoiValidationPipe(createUserSchema)) createUserDto: CreateUserRequest) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Authorized(UserRole.Admin)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Authorized(UserRole.Admin)
  @ApiParam({ name: 'id', type: 'string' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @Authorized(UserRole.Admin)
  @ApiParam({ name: 'id', type: 'string' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new JoiValidationPipe(updateUserSchema)) updateUserDto: UpdateUserRequest,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Authorized(UserRole.Admin)
  @ApiParam({ name: 'id', type: 'string' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.remove(id);
  }
}
