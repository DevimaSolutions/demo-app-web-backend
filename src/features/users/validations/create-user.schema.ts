import * as Joi from 'joi';

import { UserRole, UserStatus } from '@/features/auth';
import { passwordRegexp } from '@/features/common';
import { CreateUserRequest } from '@/features/users';
import { Name } from '@/features/users/entities/name.embedded';

export const createUserSchema = Joi.object<CreateUserRequest>({
  name: Joi.object<Omit<Name, 'full'>>({
    first: Joi.string().trim().allow('').required().max(255),
    last: Joi.string().trim().allow('').required().max(255),
  }).required(),
  phoneNumber: Joi.string().trim().allow(null).optional().max(255),
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
