import * as Joi from 'joi';

import { PaginationQuery } from '@/features/common';

export const paginationQuerySchema = Joi.object<PaginationQuery>({
  page: Joi.number().positive().min(1).default(1).optional(),
  limit: Joi.number().positive().min(1).max(500).default(10).optional(),
});
