import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { Profile } from '@/features/profiles';
import { LearningPace } from '@/features/profiles/enums';

export class OnboardingThirdStepResponse {
  constructor(profile: Profile | null) {
    this.learningPace = profile?.learningPace ?? null;
  }

  @ApiProperty({ enum: LearningPace, nullable: true })
  learningPace: LearningPace | null;

  @ApiProperty({ type: 'boolean' })
  @Expose()
  get complete(): boolean {
    return !!this?.learningPace;
  }
}
