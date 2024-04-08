import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StripeService } from '@/features/payments/services/stripe.service';
import { Subscription } from '@/features/subscriptions/entities/subscription.entity';
import { SubscriptionPaymentSucceededListener } from '@/features/subscriptions/listeners';
import { SubscriptionsRepository } from '@/features/subscriptions/repositoies';
import { SubscriptionsController } from '@/features/subscriptions/subscriptions.controller';
import { SubscriptionsService } from '@/features/subscriptions/subscriptions.service';
import { UsersRepository } from '@/features/users';

@Module({
  imports: [TypeOrmModule.forFeature([Subscription])],
  controllers: [SubscriptionsController],
  providers: [
    SubscriptionsService,
    StripeService,
    UsersRepository,
    SubscriptionPaymentSucceededListener,
    SubscriptionsRepository,
  ],
  exports: [SubscriptionsRepository],
})
export class SubscriptionsModule {}
