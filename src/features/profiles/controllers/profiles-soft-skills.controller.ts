import { Controller, Get, Query, Req } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { Authorized } from '@/features/auth';
import { IRequestWithUser } from '@/features/auth/interfaces';
import { ApiPaginatedResponse } from '@/features/common';
import { ProfileSoftSkillsPaginateQuery } from '@/features/profiles/dto';
import { ProfileSoftSkillsService } from '@/features/profiles/services';
import { profileSoftSkillsPaginationQuerySchema } from '@/features/profiles/validations';
import { SoftSkill } from '@/features/soft-skills';
import { JoiValidationPipe } from '@/pipes';

@ApiTags('Profile')
@Controller('profile/soft-skills')
export class ProfilesSoftSkillsController {
  constructor(private readonly service: ProfileSoftSkillsService) {}
  @Get()
  @Authorized()
  @ApiPaginatedResponse(SoftSkill)
  @ApiOperation({
    summary: 'Get your soft skills.',
  })
  async index(
    @Req() req: IRequestWithUser,
    @Query(new JoiValidationPipe(profileSoftSkillsPaginationQuerySchema))
    query: ProfileSoftSkillsPaginateQuery,
  ) {
    return this.service.getProfileSoftSkills(req.user.id, query);
  }
}
