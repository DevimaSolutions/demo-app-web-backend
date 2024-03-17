import { ApiProperty } from '@nestjs/swagger';

import { Gender } from '@/features/profiles/enums';

export class OnboardingFirstStepRequest {
  @ApiProperty()
  name: string;

  @ApiProperty()
  age: number;

  @ApiProperty({ enum: Gender })
  gender: Gender;
}
