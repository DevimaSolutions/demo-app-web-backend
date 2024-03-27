import { ApiPropertyOptional } from '@nestjs/swagger';
export class LinkedinUserinfoResponse {
  @ApiPropertyOptional()
  sub?: string;

  @ApiPropertyOptional()
  email_verified?: boolean;

  @ApiPropertyOptional()
  name?: string;

  @ApiPropertyOptional()
  given_name?: string;

  @ApiPropertyOptional()
  family_name?: string;

  @ApiPropertyOptional()
  email?: string;

  @ApiPropertyOptional()
  picture?: string;
}
