import { ApiProperty } from '@nestjs/swagger';

import { UserRole, UserStatus } from '@/features/auth';
import { User } from '@/features/users';
import { Name } from '@/features/users/entities/name.embedded';

export class UserResponse {
  constructor({
    id,
    name,
    email,
    role,
    status,
    phoneNumber,
    createdAt,
    updatedAt,
    emailVerified,
  }: User) {
    Object.assign(this, {
      id,
      name,
      email,
      role,
      phoneNumber,
      status,
      createdAt,
      updatedAt,
      isEmailVerified: !!emailVerified,
    });
  }

  @ApiProperty()
  id: string;

  @ApiProperty()
  name: Name;

  @ApiProperty({ type: 'string', nullable: true })
  phoneNumber: string | null;

  @ApiProperty({ type: 'string', format: 'email' })
  email: string;

  @ApiProperty({ enum: UserRole })
  role: UserRole;

  @ApiProperty({ enum: UserStatus })
  status: UserStatus;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  isEmailVerified: boolean;
}
