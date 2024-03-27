import { ApiProperty } from '@nestjs/swagger';

export class LinkedinAuthRequest {
  @ApiProperty()
  code: string;

  @ApiProperty()
  redirect: string;
}
