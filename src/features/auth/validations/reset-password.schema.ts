import * as Joi from 'joi';

import { ResetPasswordRequest } from '@/features/auth/dto';
import { passwordRegexp, validationMessages } from '@/features/common';
export const resetPasswordSchema = Joi.object<ResetPasswordRequest>({
  token: Joi.string().trim().required(),
  password: Joi.string().trim().pattern(passwordRegexp).required().max(255).messages({
    'string.pattern.base': validationMessages.password,
  }),
});
