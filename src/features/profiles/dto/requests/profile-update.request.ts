import { ApiPropertyOptional } from '@nestjs/swagger';
import { DeepPartial } from 'typeorm';

import { Gender } from '@/features/profiles/enums';
import { User } from '@/features/users';
import { NameRequest } from '@/features/users/dto/requests/name.request';

export class ProfileUpdateRequest {
  @ApiPropertyOptional()
  name?: NameRequest;

  @ApiPropertyOptional()
  nickname?: string;

  @ApiPropertyOptional()
  age?: number;

  @ApiPropertyOptional({ enum: Gender })
  gender?: Gender;

  @ApiPropertyOptional()
  phoneNumber?: string;

  public async getData(): Promise<DeepPartial<User>> {
    return {
      ...this.getFieldObject('name'),
      ...this.getFieldObject('nickname'),
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
