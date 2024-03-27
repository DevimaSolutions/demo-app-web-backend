import { ApiProperty } from '@nestjs/swagger';

import { LearningPace } from '@/features/profiles/enums';

export class OnboardingThirdStepRequest {
  @ApiProperty({ enum: LearningPace })
  learningPace: LearningPace;
}
