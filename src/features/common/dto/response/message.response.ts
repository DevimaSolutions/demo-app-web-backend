import { ApiProperty } from '@nestjs/swagger';

export class MessageResponse {
  @ApiProperty({ description: 'Details of response' })
  message: string;
}
