import { ApiProperty } from '@nestjs/swagger';

export class SignUpRequest {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  confirmPassword: string;
}
