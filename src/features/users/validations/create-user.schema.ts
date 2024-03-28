import * as Joi from 'joi';

import { UserRole, UserStatus } from '@/features/auth';
import { passwordRegexp, nicknameRegexp, validationMessages } from '@/features/common';
import { CreateUserRequest } from '@/features/users';
import { Name } from '@/features/users/entities/name.embedded';

export const createUserSchema = Joi.object<CreateUserRequest>({
  name: Joi.object<Omit<Name, 'full'>>({
    first: Joi.string().trim().allow('').optional().max(255),
    last: Joi.string().trim().allow('').optional().max(255),
  })
    .or('first', 'last')
    .required(),
  email: Joi.string().trim().email().required().max(255),
  nickname: Joi.string().trim().max(255).pattern(nicknameRegexp).required(),
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
