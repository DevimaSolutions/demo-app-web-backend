import { ApiProperty } from '@nestjs/swagger';

export class SignInRequest {
  @ApiProperty({ example: 'example@example.com' })
  email: string;
  @ApiProperty({ example: 'Test1234' })
  password: string;
}