import { registerAs } from '@nestjs/config';

import { env } from '@/utils';

export default registerAs('stripe', () => ({
  apiKey: env.string('STRIPE_API_KEY'),
  apiVersion: env.string('STRIPE_API_VERSION'),
  webhookSecret: env.string('STRIPE_WEBHOOK_SECRET'),
}));
