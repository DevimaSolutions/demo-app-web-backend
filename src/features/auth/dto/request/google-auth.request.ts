import { ApiProperty } from '@nestjs/swagger';

export class GoogleAuthRequest {
  @ApiProperty()
  token: string;
}
