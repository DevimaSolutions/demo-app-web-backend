import * as Joi from 'joi';

import { UserRole, UserStatus } from '@/features/auth';
import { usernameRegexp, passwordRegexp, validationMessages } from '@/features/common';
import { UpdateUserRequest } from '@/features/users';

export const updateUserSchema = Joi.object<UpdateUserRequest>({
  name: Joi.string().trim().optional().max(255),
  email: Joi.string().trim().email().optional().max(255),
  username: Joi.string().trim().max(255).pattern(usernameRegexp).optional(),
  password: Joi.string().trim().pattern(passwordRegexp).max(255).messages({
    'string.pattern.base': validationMessages.password,
  }),
  role: Joi.string()
    .valid(...Object.values(UserRole))
    .optional(),
  status: Joi.string()
    .valid(...Object.values(UserStatus))
    .optional(),
});
