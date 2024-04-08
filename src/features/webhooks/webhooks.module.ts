import { Module } from '@nestjs/common';

import { StripeWebhookController } from './controllers';

import { StripeService } from '@/features/payments';
import { StripeWebhookService } from '@/features/webhooks/services';

@Module({
  controllers: [StripeWebhookController],
  providers: [StripeService, StripeWebhookService],
})
export class WebhooksModule {}
