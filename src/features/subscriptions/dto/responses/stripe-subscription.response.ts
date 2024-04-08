import { ApiProperty } from '@nestjs/swagger';
import Stripe from 'stripe';

export class StripeSubscriptionResponse {
  constructor(subscription: Stripe.Price) {
    this.id = subscription.id;
    this.name = (subscription.product as Stripe.Product).name;
    this.currency = subscription.currency;
    this.description = (subscription.product as Stripe.Product)?.description ?? '';
    this.interval = subscription.recurring?.interval ?? null;
    this.price = subscription?.unit_amount ? subscription?.unit_amount / 100 : 0.0;
  }

  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ type: 'number', format: 'float' })
  price: number;

  @ApiProperty()
  currency: string;

  @ApiProperty({ type: 'string', enum: ['day', 'month', 'week', 'year'] })
  interval: Stripe.Price.Recurring.Interval | null;
}
