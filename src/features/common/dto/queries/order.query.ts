import { ApiPropertyOptional } from '@nestjs/swagger';

import { OrderDirection } from '@/features/common';

export class OrderQuery {
  @ApiPropertyOptional({
    enum: OrderDirection,
    default: OrderDirection.Desc,
  })
  orderDirection: OrderDirection = OrderDirection.Desc;

  @ApiPropertyOptional({
    default: 'createdAt',
  })
  orderBy: string | string[];
}
