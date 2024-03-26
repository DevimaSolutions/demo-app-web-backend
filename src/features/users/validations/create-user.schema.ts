import * as Joi from 'joi';

import { UserRole, UserStatus } from '@/features/auth';
import { passwordRegexp, validationMessages } from '@/features/common';
import { CreateUserRequest } from '@/features/users';
import { Name } from '@/features/users/entities/name.embedded';

export const createUserSchema = Joi.object<CreateUserRequest>({
  name: Joi.object<Omit<Name, 'full'>>({
    first: Joi.string().trim().allow('').required().max(255),
    last: Joi.string().trim().allow('').required().max(255),
  }).required(),
  email: Joi.string().trim().email().required().max(255),
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
