import { ApiProperty } from '@nestjs/swagger';

import { IPaginationResponse } from '@/features/common/interfaces';

export class PaginationResponse<Entity, EntityTransform> {
  constructor({
    items,
    page,
    limit,
    total,
    transformer,
  }: IPaginationResponse<Entity, EntityTransform>) {
    this.items = transformer ? items.map((item) => new transformer(item)) : items;
    this.page = page;
    this.limit = limit;
    this.total = total;
    const totalPages = Math.ceil(total / limit);
    this.hasMore = page < totalPages;
  }

  @ApiProperty({ isArray: true })
  readonly items: EntityTransform[] | Entity[];

  @ApiProperty()
  readonly page?: number;

  @ApiProperty()
  readonly limit: number;

  @ApiProperty()
  readonly total: number;

  @ApiProperty()
  readonly hasMore: boolean;
}
