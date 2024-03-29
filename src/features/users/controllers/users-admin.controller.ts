import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  Req,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

import { CreateUserRequest, UpdateUserRequest, UserPaginateQuery, UserResponse } from '../dto';
import { UsersService } from '../services';

import { Authorized, UserRole } from '@/features/auth';
import { IRequestWithUser } from '@/features/auth/interfaces';
import { ApiPaginatedResponse } from '@/features/common';
import {
  updateUserSchema,
  createUserSchema,
  userPaginationQuerySchema,
} from '@/features/users/validations';
import { JoiValidationPipe } from '@/pipes';

@ApiTags('Admin')
@Controller('admin/users')
export class UsersAdminController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Authorized(UserRole.Admin)
  @ApiPaginatedResponse(UserResponse)
  @ApiOperation({
    description:
      '### You will be able to use this operation only when the user is in the *role  admin*',
    summary: 'Get all users',
  })
  index(
    @Req() req: IRequestWithUser,
    @Query(new JoiValidationPipe(userPaginationQuerySchema))
    query: UserPaginateQuery,
  ) {
    return this.usersService.findAllPaginate(query);
  }

  @Get(':id')
  @Authorized(UserRole.Admin)
  @ApiParam({ name: 'id', type: 'string' })
  @ApiOperation({
    description:
      '### You will be able to use this operation only when the user is in the *role  admin*',
    summary: 'Get a specific user by id',
  })
  show(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findOne(id);
  }

  @Post()
  @Authorized(UserRole.Admin)
  @ApiOperation({
    description:
      '### You will be able to use this operation only when the user is in the *role  admin*',
    summary: 'Create a new user',
  })
  create(@Body(new JoiValidationPipe(createUserSchema)) request: CreateUserRequest) {
    return this.usersService.create(request);
  }

  @Patch(':id')
  @Authorized(UserRole.Admin)
  @ApiParam({ name: 'id', type: 'string' })
  @ApiOperation({
    description:
      '### You will be able to use this operation only when the user is in the *role  admin*',
    summary: 'Update a specific user by id',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new JoiValidationPipe(updateUserSchema)) request: UpdateUserRequest,
  ) {
    return this.usersService.update(id, request);
  }

  @Delete(':id')
  @Authorized(UserRole.Admin)
  @ApiParam({ name: 'id', type: 'string' })
  @ApiOperation({
    description:
      '### You will be able to use this operation only when the user is in the *role  admin*',
    summary: 'Remove a specific user by id',
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.remove(id);
  }
}
