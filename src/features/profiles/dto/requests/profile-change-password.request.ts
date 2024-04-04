import { ApiProperty } from '@nestjs/swagger';

export class ProfileChangePasswordRequest {
  @ApiProperty()
  oldPassword: string;

  @ApiProperty()
  newPassword: string;
}
