import * as Joi from 'joi';

import { passwordRegexp, validationMessages } from '@/features/common';
import { ProfileChangePasswordRequest } from '@/features/profiles';
export const profileChangePasswordSchema = Joi.object<ProfileChangePasswordRequest>({
  password: Joi.string().trim().pattern(passwordRegexp).required().max(255).messages({
    'string.pattern.base': validationMessages.password,
  }),
  confirmPassword: Joi.string()
    .equal(Joi.ref('password'))
    .required()
    .messages({ 'any.only': validationMessages.passwordDontMatch }),
});
