import { ApiProperty } from '@nestjs/swagger';

export class ConfirmEmailRequest {
  @ApiProperty()
  token: string;
}
