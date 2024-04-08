import { ApiProperty } from '@nestjs/swagger';

export class StripeSubscriptionSessionResponse {
  constructor(url: string) {
    this.sessionUrl = url;
  }

  @ApiProperty({ type: 'string', format: 'url' })
  sessionUrl: string;
}
