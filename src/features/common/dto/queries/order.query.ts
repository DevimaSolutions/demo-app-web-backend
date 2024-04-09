import { ApiPropertyOptional } from '@nestjs/swagger';

import { Order } from '@/features/common';

export class OrderQuery {
  @ApiPropertyOptional({
    enum: Order,
    default: Order.Desc,
  })
  order: Order = Order.Desc;

  @ApiPropertyOptional({
    default: 'createdAt',
  })
  sort: string | string[];
}
