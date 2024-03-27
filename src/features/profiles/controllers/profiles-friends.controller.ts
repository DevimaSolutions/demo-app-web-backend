import { Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Query, Req } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';

import { Authorized } from '@/features/auth';
import { IRequestWithUser } from '@/features/auth/interfaces';
import { ProfileFriendsPaginateQuery } from '@/features/profiles/dto';
import { ProfileFriendsService } from '@/features/profiles/services';
import { profileFriendsPaginationQuerySchema } from '@/features/profiles/validations';
import { JoiValidationPipe } from '@/pipes';

@ApiTags('Profile')
@Controller('profile/friends')
export class ProfilesFriendsController {
  constructor(private readonly service: ProfileFriendsService) {}
  @Get('')
  @Authorized()
  async index(
    @Req() req: IRequestWithUser,
    @Query(new JoiValidationPipe(profileFriendsPaginationQuerySchema))
    query: ProfileFriendsPaginateQuery,
  ) {
    return this.service.getFriends(req.user, query);
  }

  @Patch(':friendId')
  @Authorized()
  @ApiParam({ name: 'friendId', type: 'string' })
  async add(@Req() req: IRequestWithUser, @Param('friendId', ParseUUIDPipe) friendId: string) {
    return this.service.addFriend(req.user.id, friendId);
  }

  @Delete(':friendId')
  @Authorized()
  @ApiParam({ name: 'friendId', type: 'string' })
  async remove(@Req() req: IRequestWithUser, @Param('friendId', ParseUUIDPipe) friendId: string) {
    return this.service.removeFriend(req.user.id, friendId);
  }
}
