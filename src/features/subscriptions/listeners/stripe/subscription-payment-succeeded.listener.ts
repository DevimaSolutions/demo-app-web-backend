import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import Stripe from 'stripe';

import { StripeService } from '@/features/payments';
import { SubscriptionPaymentSucceededEvent } from '@/features/subscriptions';
import { SubscriptionPaymentMethod, SubscriptionType } from '@/features/subscriptions/enums';
import { SubscriptionsRepository } from '@/features/subscriptions/repositoies';

@Injectable()
export class SubscriptionPaymentSucceededListener {
  constructor(
    private readonly stripe: StripeService,
    private readonly subscriptionsRepository: SubscriptionsRepository,
  ) {}

  @OnEvent('subscription.payment.succeeded', { async: true })
  async handleOrderCreatedEvent(event: SubscriptionPaymentSucceededEvent) {
    const stripSubscription = await this.updateStripeSubscriptionPaymentMethod(
      event.subscriptionId,
      event.paymentIntentId,
    );

    const data = {
      user: { id: stripSubscription.metadata.userId },
      metadata: {
        priceId: stripSubscription.items.data[0].plan.id,
        subscriptionId: stripSubscription.id,
      },
      type: (stripSubscription.items.data[0].plan?.product as Stripe.Product)?.metadata
        .type as SubscriptionType,
      paymentMethod: SubscriptionPaymentMethod.Stripe,
      name: (stripSubscription.items.data[0].plan?.product as Stripe.Product)?.name ?? '',
      description:
        (stripSubscription.items.data[0].plan?.product as Stripe.Product)?.description ?? null,
      startAt: new Date(stripSubscription.current_period_start * 1000),
      endAt: new Date(stripSubscription.current_period_end * 1000),
    };

    const subscription = await this.subscriptionsRepository.findOneBy({
      user: { id: data.user.id },
      type: data.type,
    });

    if (subscription) {
      await this.subscriptionsRepository.update(subscription.id, data);
    } else {
      await this.subscriptionsRepository.save(data);
    }
  }
  async updateStripeSubscriptionPaymentMethod(subscriptionId: string, paymentIntentId: string) {
    let subscription = await this.stripe.subscriptionRetrieve(subscriptionId);

    if (!subscription.default_payment_method) {
      const paymentIntent = await this.stripe.paymentIntentRetrieve(paymentIntentId);

      try {
        subscription = await this.stripe.subscriptionUpdate(subscriptionId, {
          default_payment_method: paymentIntent.payment_method as string,
          expand: ['items.data.plan.product'],
        });
      } catch (_err) {}
    }
    return subscription;
  }
}
