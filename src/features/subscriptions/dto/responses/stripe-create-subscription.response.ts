import { ApiProperty } from '@nestjs/swagger';

export class StripeCreateSubscriptionResponse {
  constructor(id: string, secret: string) {
    this.subscriptionId = id;
    this.clientSecret = secret;
  }

  @ApiProperty()
  subscriptionId: string;

  @ApiProperty()
  clientSecret: string;
}
