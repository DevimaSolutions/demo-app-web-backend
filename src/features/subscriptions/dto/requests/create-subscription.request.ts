import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { SubscriptionType } from '@/features/subscriptions/enums/subscription-type.enum';

export class CreateSubscriptionRequest {
  @ApiProperty({ maximum: 255 })
  name: string;

  @ApiProperty({ type: 'number', format: 'float' })
  price: number;

  @ApiProperty()
  description: string;

  @ApiPropertyOptional({ type: 'enum', enum: SubscriptionType, default: SubscriptionType.Monthly })
  type: SubscriptionType;
}
