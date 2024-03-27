import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { Profile } from '@/features/profiles';
import { ProfileType } from '@/features/profiles/enums';

export class OnboardingSecondStepResponse {
  constructor(profile: Profile | null) {
    this.profileType = profile?.profileType ?? null;
  }
  @ApiProperty({ enum: ProfileType, nullable: true })
  profileType: ProfileType | null;

  @ApiProperty({ type: 'boolean' })
  @Expose()
  get complete(): boolean {
    return !!this?.profileType;
  }
}
