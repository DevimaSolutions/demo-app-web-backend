import { ApiProperty } from '@nestjs/swagger';

export class StripeCreateSubscriptionSessionRequest {
  @ApiProperty()
  stripPriceId: string;

  @ApiProperty({ type: 'string', format: 'url' })
  successUrl: string;

  @ApiProperty({ type: 'string', format: 'url' })
  cancelUrl: string;
}
