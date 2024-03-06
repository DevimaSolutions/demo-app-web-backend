import * as Joi from 'joi';

import { UserRole, UserStatus } from '@/features/auth';
import { passwordRegexp } from '@/features/common';
import { UpdateUserRequest } from '@/features/users';
import { Name } from '@/features/users/entities/name.embedded';

export const updateUserSchema = Joi.object<UpdateUserRequest>({
  name: Joi.object<Omit<Name, 'full'>>({
    first: Joi.string().trim().optional().max(255),
    last: Joi.string().trim().optional().max(255),
  }).optional(),
  phoneNumber: Joi.string().trim().allow(null).optional().max(255),
  email: Joi.string().trim().email().optional().max(255),
  password: Joi.string().trim().pattern(passwordRegexp).max(255).messages({
    'string.pattern.base':
      'The password must be a string of 8-64 symbols. Must contain a combination of lowercase letters, uppercase letters, and numbers.',
  }),
  role: Joi.string()
    .valid(...Object.values(UserRole))
    .optional(),
  status: Joi.string()
    .valid(...Object.values(UserStatus))
    .optional(),
});
