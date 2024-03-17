import { Controller, Get, Put, Body, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ProfilesService } from './profiles.service';

import { Authorized } from '@/features/auth';
import { IRequestWithUser } from '@/features/auth/interfaces';
import { OnboardingRequest } from '@/features/profiles/dto';
import { onboardingProfileSchema } from '@/features/profiles/validations';
import { JoiValidationPipe } from '@/pipes';

@ApiTags('Profile')
@Controller('profile')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Put('/onboarding')
  @Authorized()
  async onboarding(
    @Req() req: IRequestWithUser,
    @Body(new JoiValidationPipe(onboardingProfileSchema))
    request: OnboardingRequest,
  ) {
    return await this.profilesService.onboarding(req.user.id, request);
  }

  @Get('/onboarding')
  @Authorized()
  async getOnboarding(@Req() req: IRequestWithUser) {
    return await this.profilesService.getOnboarding(req.user.id);
  }
}
