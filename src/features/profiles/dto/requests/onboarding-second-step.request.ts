import { ApiProperty } from '@nestjs/swagger';

import { ProfileType } from '@/features/profiles/enums';

export class OnboardingSecondStepRequest {
  @ApiProperty({ enum: ProfileType })
  profileType: ProfileType;
}
