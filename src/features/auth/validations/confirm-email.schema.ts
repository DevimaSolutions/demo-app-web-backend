import * as Joi from 'joi';

import { ConfirmEmailRequest } from '@/features/auth/dto';
export const confirmEmailSchema = Joi.object<ConfirmEmailRequest>({
  code: Joi.string().min(4).max(4).trim().required(),
});
