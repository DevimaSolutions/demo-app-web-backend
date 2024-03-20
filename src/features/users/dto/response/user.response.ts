import { ApiProperty } from '@nestjs/swagger';

import { UserRole, UserStatus } from '@/features/auth';
import { FileResponse } from '@/features/files';
import { SoftSkill } from '@/features/soft-skills';
import { User } from '@/features/users';
import { Name } from '@/features/users/entities/name.embedded';

export class UserResponse {
  constructor(user: User) {
    this.id = user.id;
    this.name = user.name;
    this.phoneNumber = user.phoneNumber;
    this.email = user.email;
    this.role = user.role;
    this.status = user.status;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
    this.isEmailVerified = !!user.emailVerified;
    this.isOnboardingCompleted = user?.profile?.isOnboardingCompleted ?? false;
    this.avatar = user?.profile?.profileImage
      ? new FileResponse(user?.profile?.profileImage)
      : null;

    this.softSkills = user?.usersToSkills?.map((item) => item.softSkill) ?? [];
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

  @ApiProperty({ type: FileResponse, nullable: true })
  avatar: FileResponse | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  isEmailVerified: boolean;

  @ApiProperty()
  isOnboardingCompleted: boolean;

  @ApiProperty({ type: SoftSkill, isArray: true })
  softSkills: SoftSkill[];
}
