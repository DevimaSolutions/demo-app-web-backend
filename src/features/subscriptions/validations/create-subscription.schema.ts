import * as Joi from 'joi';

import { CreateSubscriptionRequest } from '@/features/subscriptions/dto';
import { SubscriptionType } from '@/features/subscriptions/enums';

export const createSubscriptionSchema = Joi.object<CreateSubscriptionRequest>({
  name: Joi.string().trim().optional().max(255),
  price: Joi.number().precision(2).strict().min(0.01).max(9999.99).required(),
  description: Joi.string().trim().allow('').max(255).required(),
  type: Joi.string()
    .valid(...Object.values(SubscriptionType))
    .default(SubscriptionType.Monthly)
    .optional(),
});
