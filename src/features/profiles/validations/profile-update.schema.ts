import * as Joi from 'joi';

import { usernameRegexp } from '@/features/common';
import { Gender, ProfileUpdateRequest } from '@/features/profiles';
export const profileUpdateSchema = Joi.object<ProfileUpdateRequest>({
  name: Joi.string().trim().max(255).allow('').optional(),
  age: Joi.number().positive().min(13).max(150).optional(),
  gender: Joi.string()
    .valid(...Object.values(Gender))
    .optional(),
  username: Joi.string().trim().max(255).pattern(usernameRegexp).optional(),
  phoneNumber: Joi.string().trim().max(255).optional(),
});
