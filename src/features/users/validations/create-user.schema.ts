import * as Joi from 'joi';

import { UserRole, UserStatus } from '@/features/auth';
import { passwordRegexp } from '@/features/common';
import { UpdateUserRequest } from '@/features/users';

export const createUserSchema = Joi.object<UpdateUserRequest>({
  email: Joi.string().trim().email().required().max(255),
  password: Joi.string().trim().pattern(passwordRegexp).required().max(255).messages({
    'string.pattern.base':
      'The password must be a string of 8-64 symbols. Must contain a combination of lowercase letters, uppercase letters, and numbers.',
  }),
  role: Joi.number()
    .valid(...Object.values(UserRole))
    .required(),
  status: Joi.number()
    .valid(...Object.values(UserStatus))
    .required(),
});
