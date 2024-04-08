import { ApiProperty } from '@nestjs/swagger';

import { Subscription } from '@/features/subscriptions/entities';

export class SubscriptionResponse {
  constructor(subscription: Subscription) {
    this.id = subscription.id;
    this.name = subscription.name;
    this.description = subscription.description;
    this.startAt = subscription.startAt;
    this.endAt = subscription.endAt;
  }

  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ type: 'string', nullable: true })
  description: string | null;

  @ApiProperty()
  startAt: Date;

  @ApiProperty()
  endAt: Date;
}
