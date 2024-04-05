import { ApiProperty } from '@nestjs/swagger';

export class ProfileChangePasswordRequest {
  @ApiProperty()
  password: string;

  @ApiProperty()
  confirmPassword: string;
}
