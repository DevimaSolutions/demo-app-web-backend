import { ApiProperty } from '@nestjs/swagger';

import { UserRole, UserStatus } from '@/features/auth';
import { User } from '@/features/users';

export class UserResponse {
  constructor({ id, email, role, status }: User) {
    Object.assign(this, { id, email, role, status });
  }

  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  role: UserRole;

  @ApiProperty()
  status: UserStatus;
}
