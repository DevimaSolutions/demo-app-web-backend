import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';

import { PaginationQuery } from '@/features/common';

export class UserPaginateQuery extends IntersectionType(PaginationQuery) {
  @ApiPropertyOptional()
  search: string;
}
