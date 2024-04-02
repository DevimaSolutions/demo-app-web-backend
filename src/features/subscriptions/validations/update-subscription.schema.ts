import * as Joi from 'joi';

import { SubscriptionType } from '@/features/subscriptions';
import { UpdateSubscriptionRequest } from '@/features/subscriptions/dto';

export const updateSubscriptionSchema = Joi.object<UpdateSubscriptionRequest>({
  name: Joi.string().trim().optional().max(255),
  price: Joi.number().precision(2).strict().min(0.01).max(9999.99).optional(),
  description: Joi.string().trim().allow('').max(255).optional(),
  type: Joi.string()
    .valid(...Object.values(SubscriptionType))
    .optional(),
});
