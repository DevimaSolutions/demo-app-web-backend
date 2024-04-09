import * as Joi from 'joi';

import { UserRole, UserStatus } from '@/features/auth';
import { passwordRegexp, usernameRegexp, validationMessages } from '@/features/common';
import { CreateUserRequest } from '@/features/users';

export const createUserSchema = Joi.object<CreateUserRequest>({
  name: Joi.string().trim().allow('').optional().max(255),
  email: Joi.string().trim().email().required().max(255),
  username: Joi.string().trim().max(255).pattern(usernameRegexp).required(),
  password: Joi.string().trim().pattern(passwordRegexp).required().max(255).messages({
    'string.pattern.base': validationMessages.password,
  }),
  role: Joi.string()
    .valid(...Object.values(UserRole))
    .required(),
  status: Joi.string()
    .valid(...Object.values(UserStatus))
    .required(),
});
