import { ApiProperty } from '@nestjs/swagger';

export class JwtTokensResponse {
  @ApiProperty()
  accessToken: string;
  @ApiProperty()
  refreshToken: string;
}
