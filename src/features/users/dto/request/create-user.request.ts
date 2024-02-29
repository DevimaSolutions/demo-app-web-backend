import { ApiProperty } from '@nestjs/swagger';

import { UserRole, UserStatus } from '@/features/auth';

export class CreateUserRequest {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  role: UserRole;

  @ApiProperty()
  status?: UserStatus;
}
