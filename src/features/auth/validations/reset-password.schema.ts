import * as Joi from 'joi';

import { ResetPasswordRequest } from '@/features/auth/dto';
import { passwordRegexp } from '@/features/common';
export const resetPasswordSchema = Joi.object<ResetPasswordRequest>({
  token: Joi.string().trim().required(),
  password: Joi.string().trim().pattern(passwordRegexp).required().max(255).messages({
    'string.pattern.base':
      'The password must be a string of 8-64 symbols. Must contain a combination of lowercase letters, uppercase letters, and numbers.',
  }),
});
