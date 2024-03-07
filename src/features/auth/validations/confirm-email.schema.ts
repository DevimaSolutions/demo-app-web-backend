import * as Joi from 'joi';

import { ConfirmEmailRequest } from '@/features/auth/dto';
export const confirmEmailSchema = Joi.object<ConfirmEmailRequest>({
  token: Joi.string().trim().required(),
});
