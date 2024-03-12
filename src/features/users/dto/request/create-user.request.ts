import { ApiProperty } from '@nestjs/swagger';

import { NameRequest } from './name.request';

import { UserRole, UserStatus } from '@/features/auth';

export class CreateUserRequest {
  @ApiProperty()
  name: NameRequest;

  @ApiProperty({ type: 'string', format: 'email' })
  email: string;

  @ApiProperty({ type: 'string', required: false, nullable: true })
  phoneNumber: string | null;

  @ApiProperty()
  password: string;

  @ApiProperty({ enum: UserRole })
  role: UserRole;

  @ApiProperty({ enum: UserStatus })
  status?: UserStatus;
}
