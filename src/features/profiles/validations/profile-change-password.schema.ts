import * as Joi from 'joi';

import { passwordRegexp, validationMessages } from '@/features/common';
import { ProfileChangePasswordRequest } from '@/features/profiles';
export const profileChangePasswordSchema = Joi.object<ProfileChangePasswordRequest>({
  oldPassword: Joi.string().trim().max(255).required().messages({
    'string.pattern.base': validationMessages.password,
  }),
  newPassword: Joi.string()
    .trim()
    .pattern(passwordRegexp)
    .disallow(Joi.ref('oldPassword'))
    .max(255)
    .required()
    .messages({
      'string.pattern.base': validationMessages.password,
      'any.invalid': validationMessages.passwordMustBeDifferent,
    }),
});
