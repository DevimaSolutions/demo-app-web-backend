import * as Joi from 'joi';

import { StripeCreateSubscriptionSessionRequest } from '@/features/subscriptions';

export const stripeCreateSubscriptionSessionSchema =
  Joi.object<StripeCreateSubscriptionSessionRequest>({
    stripPriceId: Joi.string().trim().required().max(255),
    successUrl: Joi.string().trim().uri().required().max(255),
    cancelUrl: Joi.string().trim().uri().required().max(255),
  });
