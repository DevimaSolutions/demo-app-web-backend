import { ApiProperty } from '@nestjs/swagger';

export class OnboardingFourthStepRequest {
  @ApiProperty({ format: 'uuid' })
  softSkills: string[];
}
