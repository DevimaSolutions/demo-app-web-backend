import { ApiPropertyOptional } from '@nestjs/swagger';
import { DeepPartial } from 'typeorm';

import { Gender } from '@/features/profiles/enums';
import { HasherService, User } from '@/features/users';
import { NameRequest } from '@/features/users/dto/request/name.request';

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
  phoneNumber: string;

  @ApiPropertyOptional()
  password?: string;

  public async getData(): Promise<DeepPartial<User>> {
    return {
      ...(await this.getHashedPassword()),
      ...this.getFieldObject('name'),
      ...this.getFieldObject('nickname'),
      ...this.getFieldObject('phoneNumber'),
      profile: {
        ...this.getFieldObject('age'),
        ...this.getFieldObject('gender'),
      },
    };
  }

  private getFieldObject<P extends keyof ProfileUpdateRequest>(key: P) {
    return this[key] ? { [key]: this[key] } : {};
  }

  private async getHashedPassword() {
    const hasher = new HasherService();
    return this.password ? { password: await hasher.hash(this.password) } : {};
  }
}
