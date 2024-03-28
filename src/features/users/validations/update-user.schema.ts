import * as Joi from 'joi';

import { UserRole, UserStatus } from '@/features/auth';
import { nicknameRegexp, passwordRegexp, validationMessages } from '@/features/common';
import { UpdateUserRequest } from '@/features/users';
import { Name } from '@/features/users/entities/name.embedded';

export const updateUserSchema = Joi.object<UpdateUserRequest>({
  name: Joi.object<Omit<Name, 'full'>>({
    first: Joi.string().trim().optional().max(255),
    last: Joi.string().trim().optional().max(255),
  })
    .or('first', 'last')
    .optional(),
  email: Joi.string().trim().email().optional().max(255),
  nickname: Joi.string().trim().max(255).pattern(nicknameRegexp).optional(),
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
