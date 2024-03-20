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

import { CreateUserRequest, UpdateUserRequest, UserPaginateQuery, UserResponse } from './dto';
import { UsersService } from './services';

import { Authorized, UserRole } from '@/features/auth';
import { IRequestWithUser } from '@/features/auth/interfaces';
import { ApiPaginatedResponse } from '@/features/common';
import {
  updateUserSchema,
  createUserSchema,
  userPaginationQuerySchema,
} from '@/features/users/validations';
import { JoiValidationPipe } from '@/pipes';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Authorized()
  @ApiPaginatedResponse(UserResponse)
  index(
    @Req() req: IRequestWithUser,
    @Query(new JoiValidationPipe(userPaginationQuerySchema))
    query: UserPaginateQuery,
  ) {
    return this.usersService.findAllPaginate(query, req.user);
  }

  @Get(':id')
  @Authorized(UserRole.Admin)
  @ApiParam({ name: 'id', type: 'string' })
  @ApiOperation({ description: 'Roles required: Admin', deprecated: true })
  show(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findOne(id);
  }

  @Post()
  @Authorized(UserRole.Admin)
  @ApiOperation({ description: 'Roles required: Admin', deprecated: true })
  create(@Body(new JoiValidationPipe(createUserSchema)) createUserDto: CreateUserRequest) {
    return this.usersService.create(createUserDto);
  }

  @Patch(':id')
  @Authorized(UserRole.Admin)
  @ApiParam({ name: 'id', type: 'string' })
  @ApiOperation({ description: 'Roles required: Admin', deprecated: true })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new JoiValidationPipe(updateUserSchema)) updateUserDto: UpdateUserRequest,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Authorized(UserRole.Admin)
  @ApiParam({ name: 'id', type: 'string' })
  @ApiOperation({ description: 'Roles required: Admin', deprecated: true })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.remove(id);
  }
}
