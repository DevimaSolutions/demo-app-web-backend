import { ApiPropertyOptional } from '@nestjs/swagger';
import { DeepPartial } from 'typeorm';

import { UserRole, UserStatus } from '@/features/auth';
import { HasherService, User } from '@/features/users';

export class UpdateUserRequest {
  @ApiPropertyOptional()
  name?: string;

  @ApiPropertyOptional({ type: 'string', format: 'email' })
  email?: string;

  @ApiPropertyOptional()
  username?: string;

  @ApiPropertyOptional()
  password?: string;

  @ApiPropertyOptional({ enum: UserRole })
  role?: UserRole;

  @ApiPropertyOptional({ enum: UserStatus })
  status?: UserStatus;

  public async getData(): Promise<DeepPartial<User>> {
    return {
      ...(await this.getHashedPassword()),
      ...this.getFieldObject('name'),
      ...this.getFieldObject('email'),
      ...this.getFieldObject('username'),
      ...this.getFieldObject('role'),
      ...this.getFieldObject('status'),
    };
  }

  private getFieldObject<P extends keyof UpdateUserRequest>(key: P) {
    return this[key] ? { [key]: this[key] } : {};
  }

  private async getHashedPassword() {
    const hasher = new HasherService();
    return this.password ? { password: await hasher.hash(this.password) } : {};
  }
}
