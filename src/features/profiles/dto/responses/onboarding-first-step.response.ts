import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { Gender } from '@/features/profiles/enums';
import { User } from '@/features/users';

export class OnboardingFirstStepResponse {
  constructor(user: User) {
    this.name = user.name;
    this.age = user?.profile?.age ?? null;
    this.gender = user?.profile?.gender ?? null;
  }

  @ApiProperty({ type: 'string', nullable: true })
  name: string | null;

  @ApiProperty({ type: 'number', nullable: true })
  age: number | null;

  @ApiProperty({ enum: Gender, nullable: true })
  gender: Gender | null;

  @ApiProperty({ type: 'boolean' })
  @Expose()
  get complete(): boolean {
    return Object.values(this).reduce((acc, item) => acc && this.validation(item), true);
  }
  private validation(item: keyof typeof this) {
    return item !== null && item !== '';
  }
}
