import { ApiProperty } from '@nestjs/swagger';

import { UserRole, UserStatus } from '@/features/auth';
import { User } from '@/features/users';
import { Name } from '@/features/users/entities/name.embedded';

export class UserResponse {
  constructor({ id, name, email, role, status, phoneNumber, createdAt, updatedAt }: User) {
    Object.assign(this, { id, name, email, role, phoneNumber, status, createdAt, updatedAt });
  }

  @ApiProperty()
  id: string;

  @ApiProperty()
  name: Name;

  @ApiProperty({ type: 'string', nullable: true })
  phoneNumber: string | null;

  @ApiProperty()
  email: string;

  @ApiProperty()
  role: UserRole;

  @ApiProperty()
  status: UserStatus;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
