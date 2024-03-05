import * as Joi from 'joi';

import { ForgotPasswordRequest } from '@/features/auth/dto';

export const forgotPasswordSchema = Joi.object<ForgotPasswordRequest>({
  email: Joi.string().trim().email().required().max(255),
});
