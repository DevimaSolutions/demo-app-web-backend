import { Controller, Get, Query, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Authorized } from '@/features/auth';
import { IRequestWithUser } from '@/features/auth/interfaces';
import { ProfileSoftSkillsPaginateQuery } from '@/features/profiles/dto';
import { ProfileSoftSkillsService } from '@/features/profiles/services';
import { profileSoftSkillsPaginationQuerySchema } from '@/features/profiles/validations';
import { JoiValidationPipe } from '@/pipes';

@ApiTags('Profile')
@Controller('profile/soft-skills')
export class ProfilesSoftSkillsController {
  constructor(private readonly service: ProfileSoftSkillsService) {}
  @Get()
  @Authorized()
  async index(
    @Req() req: IRequestWithUser,
    @Query(new JoiValidationPipe(profileSoftSkillsPaginationQuerySchema))
    query: ProfileSoftSkillsPaginateQuery,
  ) {
    return this.service.getProfileSoftSkills(req.user.id, query);
  }
}
