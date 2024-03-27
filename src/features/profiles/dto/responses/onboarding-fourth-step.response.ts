import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { SoftSkill } from '@/features/soft-skills';
import { User } from '@/features/users';

export class OnboardingFourthStepResponse {
  constructor(user: User) {
    this.softSkills = user?.usersToSkills?.map((item) => item.softSkill) ?? [];
  }

  @ApiProperty({ type: SoftSkill })
  softSkills: SoftSkill[];

  @ApiProperty({ type: 'boolean' })
  @Expose()
  get complete(): boolean {
    return this.softSkills.length > 0;
  }
}
