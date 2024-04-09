import { ApiPropertyOptional } from '@nestjs/swagger';
import { DeepPartial } from 'typeorm';

import { Gender } from '@/features/profiles/enums';
import { User } from '@/features/users';

export class ProfileUpdateRequest {
  @ApiPropertyOptional()
  name?: string;

  @ApiPropertyOptional()
  username?: string;

  @ApiPropertyOptional()
  age?: number;

  @ApiPropertyOptional({ enum: Gender })
  gender?: Gender;

  @ApiPropertyOptional()
  phoneNumber?: string;

  public async getData(): Promise<DeepPartial<User>> {
    return {
      ...this.getFieldObject('name'),
      ...this.getFieldObject('username'),
      profile: {
        ...this.getFieldObject('age'),
        ...this.getFieldObject('gender'),
        ...this.getFieldObject('phoneNumber'),
      },
    };
  }

  private getFieldObject<P extends keyof ProfileUpdateRequest>(key: P) {
    return this[key] ? { [key]: this[key] } : {};
  }
}
