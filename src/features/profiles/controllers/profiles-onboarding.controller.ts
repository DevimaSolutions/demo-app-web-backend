import { Body, Controller, Get, Put, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Authorized } from '@/features/auth';
import { IRequestWithUser } from '@/features/auth/interfaces';
import { OnboardingRequest } from '@/features/profiles/dto';
import { ProfileOnboardingService } from '@/features/profiles/services';
import { onboardingProfileSchema } from '@/features/profiles/validations';
import { JoiValidationPipe } from '@/pipes';

@ApiTags('Profile')
@Controller('profile/onboarding')
export class ProfilesOnboardingController {
  constructor(private readonly service: ProfileOnboardingService) {}
  @Put()
  @Authorized()
  async create(
    @Req() req: IRequestWithUser,
    @Body(new JoiValidationPipe(onboardingProfileSchema))
    request: OnboardingRequest,
  ) {
    return await this.service.onboarding(req.user.id, request);
  }

  @Get()
  @Authorized()
  async show(@Req() req: IRequestWithUser) {
    return await this.service.getOnboarding(req.user.id);
  }
}
