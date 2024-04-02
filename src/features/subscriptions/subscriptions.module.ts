import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  SubscriptionsController,
  SubscriptionsAdminController,
} from '@/features/subscriptions/controllers';
import { Subscription } from '@/features/subscriptions/entities/subscription.entity';
import { SubscriptionsRepository } from '@/features/subscriptions/repositoies';
import { SubscriptionsService } from '@/features/subscriptions/subscriptions.service';

@Module({
  imports: [TypeOrmModule.forFeature([Subscription])],
  controllers: [SubscriptionsAdminController, SubscriptionsController],
  providers: [SubscriptionsService, SubscriptionsRepository],
})
export class SubscriptionsModule {}
