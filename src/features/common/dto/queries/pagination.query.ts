import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationQuery {
  @ApiPropertyOptional({
    type: 'number',
    minimum: 1,
    default: 1,
  })
  page: number;

  @ApiPropertyOptional({
    type: 'number',
    minimum: 1,
    maximum: 500,
    default: 10,
  })
  limit: number;
}
