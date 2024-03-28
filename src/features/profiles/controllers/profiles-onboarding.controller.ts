import { Body, Controller, Get, Put, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Authorized, UserStatus } from '@/features/auth';
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
  @Authorized(undefined, [UserStatus.Verified])
  async create(
    @Req() req: IRequestWithUser,
    @Body(new JoiValidationPipe(onboardingProfileSchema))
    request: OnboardingRequest,
  ) {
    return await this.service.onboarding(req.user.id, request);
  }

  @Get()
  @Authorized(undefined, [UserStatus.Pending, UserStatus.Verified])
  async show(@Req() req: IRequestWithUser) {
    return await this.service.getOnboarding(req.user.id);
  }
}
