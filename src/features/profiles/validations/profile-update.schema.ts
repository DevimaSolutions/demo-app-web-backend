import * as Joi from 'joi';

import { nicknameRegexp } from '@/features/common';
import { Gender, ProfileUpdateRequest } from '@/features/profiles';
import { NameRequest } from '@/features/users/dto/requests/name.request';
export const profileUpdateSchema = Joi.object<ProfileUpdateRequest>({
  name: Joi.object<NameRequest>({
    first: Joi.string().trim().max(255).optional(),
    last: Joi.string().trim().max(255).optional(),
  })
    .or('first', 'last')
    .optional(),
  age: Joi.number().positive().min(13).max(150).optional(),
  gender: Joi.string()
    .valid(...Object.values(Gender))
    .optional(),
  nickname: Joi.string().trim().max(255).pattern(nicknameRegexp).optional(),
  phoneNumber: Joi.string().trim().max(255).optional(),
});
