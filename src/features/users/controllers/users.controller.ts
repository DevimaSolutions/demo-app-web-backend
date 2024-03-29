import { Controller, Get, Query, Req } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { Authorized } from '@/features/auth';
import { IRequestWithUser } from '@/features/auth/interfaces';
import { ApiPaginatedResponse } from '@/features/common';
import { UserFriendResponse, UserPaginateQuery } from '@/features/users/dto';
import { UsersService } from '@/features/users/services';
import { userPaginationQuerySchema } from '@/features/users/validations';
import { JoiValidationPipe } from '@/pipes';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Authorized()
  @ApiPaginatedResponse(UserFriendResponse)
  @ApiOperation({
    description:
      '### This operation will return all active users who are not your friends or have not confirmed a friend request',
    summary: 'Get all active users.',
  })
  index(
    @Req() req: IRequestWithUser,
    @Query(new JoiValidationPipe(userPaginationQuerySchema))
    query: UserPaginateQuery,
  ) {
    return this.usersService.findAllWithFriendshipsAndPagination(query, req.user.id);
  }
}
