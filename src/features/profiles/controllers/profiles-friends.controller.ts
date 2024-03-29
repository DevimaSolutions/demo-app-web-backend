import {
  Controller,
  Delete,
  Get,
  Post,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
  Req,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

import { Authorized } from '@/features/auth';
import { IRequestWithUser } from '@/features/auth/interfaces';
import { ApiPaginatedResponse, MessageResponse } from '@/features/common';
import { ProfileFriendsPaginateQuery } from '@/features/profiles/dto';
import { ProfileFriendsService } from '@/features/profiles/services';
import { profileFriendsPaginationQuerySchema } from '@/features/profiles/validations';
import { UserFriendResponse } from '@/features/users';
import { JoiValidationPipe } from '@/pipes';

@ApiTags('Profile')
@Controller('profile/friends')
export class ProfilesFriendsController {
  constructor(private readonly service: ProfileFriendsService) {}
  @Get()
  @Authorized()
  @ApiPaginatedResponse(UserFriendResponse)
  @ApiOperation({
    summary: 'Get your friends',
  })
  async index(
    @Req() req: IRequestWithUser,
    @Query(new JoiValidationPipe(profileFriendsPaginationQuerySchema))
    query: ProfileFriendsPaginateQuery,
  ) {
    return this.service.getFriends(req.user, query);
  }

  @Post('request/:friendId')
  @Authorized()
  @ApiParam({ name: 'friendId', type: 'string' })
  @ApiOperation({
    summary: 'Send a friend request.',
  })
  async friendRequest(
    @Req() req: IRequestWithUser,
    @Param('friendId', ParseUUIDPipe) friendId: string,
  ): Promise<MessageResponse> {
    return this.service.friendRequest(req.user.id, friendId);
  }

  @Patch('request/accept/:friendId')
  @Authorized()
  @ApiOperation({
    summary: 'Accept friend request.',
  })
  async accept(
    @Req() req: IRequestWithUser,
    @Param('friendId', ParseUUIDPipe) friendId: string,
  ): Promise<MessageResponse> {
    return this.service.acceptRequest(req.user.id, friendId);
  }

  @Delete('request/decline/:friendId')
  @Authorized()
  @ApiParam({ name: 'friendId', type: 'string' })
  @ApiOperation({
    summary: 'Decline friend request.',
  })
  async decline(
    @Req() req: IRequestWithUser,
    @Param('friendId', ParseUUIDPipe) friendId: string,
  ): Promise<MessageResponse> {
    return this.service.declineRequest(req.user.id, friendId);
  }

  @Delete(':friendId')
  @Authorized()
  @ApiParam({ name: 'friendId', type: 'string' })
  @ApiOperation({
    summary: 'Remove from friends.',
  })
  async remove(
    @Req() req: IRequestWithUser,
    @Param('friendId', ParseUUIDPipe) friendId: string,
  ): Promise<MessageResponse> {
    return this.service.removeFriend(req.user.id, friendId);
  }
}
