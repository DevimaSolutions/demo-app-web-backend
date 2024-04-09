import { ApiProperty } from '@nestjs/swagger';

import { UserRole, UserStatus } from '@/features/auth';
import { FileResponse } from '@/features/files';
import { Gender } from '@/features/profiles/enums';
import { User } from '@/features/users';

export class UserResponse {
  constructor(user: User) {
    this.id = user.id;
    this.name = user.name;
    this.phoneNumber = user.profile?.phoneNumber ?? null;
    this.email = user.email;
    this.username = user.username;
    this.role = user.role;
    this.status = user.status;
    this.age = user.profile?.age ?? null;
    this.gender = user.profile?.gender ?? null;
    this.avatar = user.profile?.profileImage ? new FileResponse(user.profile?.profileImage) : null;
    this.level = user.progress?.level ?? null;
    this.experience = user.progress?.experience % 1000 ?? null; // get excess experience
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }

  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ type: 'string', nullable: true })
  phoneNumber: string | null;

  @ApiProperty({ type: 'string', format: 'email' })
  email: string;

  @ApiProperty()
  username: string;

  @ApiProperty({ type: 'number', nullable: true })
  age: number | null;

  @ApiProperty({ enum: Gender, nullable: true })
  gender: Gender | null;

  @ApiProperty({ enum: UserRole })
  role: UserRole;

  @ApiProperty({ enum: UserStatus })
  status: UserStatus;

  @ApiProperty({ type: FileResponse, nullable: true })
  avatar: FileResponse | null;

  @ApiProperty({ type: 'number', nullable: true })
  level: number | null;

  @ApiProperty({ type: 'number', nullable: true })
  experience: number | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
