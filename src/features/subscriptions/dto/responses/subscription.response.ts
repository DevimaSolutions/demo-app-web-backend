import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

import { Subscription } from '@/features/subscriptions';
import { SubscriptionType } from '@/features/subscriptions/enums/subscription-type.enum';

export class SubscriptionResponse {
  constructor(subscription: Subscription) {
    Object.assign(this, subscription);
  }

  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ type: 'number', format: 'float' })
  price: number;

  @ApiProperty()
  description: string;

  @ApiProperty({ enum: SubscriptionType })
  type: SubscriptionType;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiHideProperty()
  @Exclude()
  deletedAt: Date;
}
