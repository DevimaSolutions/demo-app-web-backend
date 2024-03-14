import * as Joi from 'joi';

import { SignUpRequest } from '@/features/auth/dto';
import { passwordRegexp, validationMessages } from '@/features/common';
export const signupSchema = Joi.object<SignUpRequest>({
  email: Joi.string().trim().email().required().max(255),
  password: Joi.string().trim().pattern(passwordRegexp).required().max(255).messages({
    'string.pattern.base': validationMessages.password,
  }),
  confirmPassword: Joi.string()
    .equal(Joi.ref('password'))
    .required()
    .messages({ 'any.only': validationMessages.passwordDontMatch }),
});
