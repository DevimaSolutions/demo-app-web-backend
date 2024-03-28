import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DeepPartial } from 'typeorm';

import { NameRequest } from './name.request';

import { UserRole, UserStatus } from '@/features/auth';
import { HasherService, User } from '@/features/users';

export class CreateUserRequest {
  @ApiProperty()
  name: NameRequest;

  @ApiProperty({ type: 'string', format: 'email' })
  email: string;

  @ApiProperty()
  nickname: string;

  @ApiProperty()
  password: string;

  @ApiProperty({ enum: UserRole })
  role: UserRole;

  @ApiPropertyOptional({ enum: UserStatus })
  status?: UserStatus;

  public async getData(): Promise<DeepPartial<User>> {
    const hasher = new HasherService();
    return {
      ...this,
      password: await hasher.hash(this.password),
    };
  }
}
