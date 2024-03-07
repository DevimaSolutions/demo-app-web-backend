import * as Joi from 'joi';

import { SignUpRequest } from '@/features/auth/dto';
import { passwordRegexp } from '@/features/common';
export const signupSchema = Joi.object<SignUpRequest>({
  email: Joi.string().trim().email().required().max(255),
  password: Joi.string().trim().pattern(passwordRegexp).required().max(255).messages({
    'string.pattern.base':
      'The password must be a string of 8-64 symbols. Must contain a combination of lowercase letters, uppercase letters, and numbers.',
  }),
  confirmPassword: Joi.string()
    .equal(Joi.ref('password'))
    .required()
    .messages({ 'any.only': "Passwords don't match" }),
});
