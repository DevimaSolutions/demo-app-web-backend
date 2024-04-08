import { Module } from '@nestjs/common';

import { PaymentsService, StripeService } from './services';

@Module({
  providers: [PaymentsService, StripeService],
  exports: [StripeService],
})
export class PaymentsModule {}
