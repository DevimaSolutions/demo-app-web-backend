import { ApiProperty } from '@nestjs/swagger';

export class ConfirmEmailRequest {
  @ApiProperty()
  code: string;
}
