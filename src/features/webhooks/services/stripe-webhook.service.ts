import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { StripeService } from '@/features/payments/services/stripe.service';
import { SubscriptionPaymentSucceededEvent } from '@/features/subscriptions';

@Injectable()
export class StripeWebhookService {
  constructor(private readonly stripe: StripeService, private readonly emitter: EventEmitter2) {}

  async handelStripeWebhook(body: Buffer, header: string) {
    const stripeEvent = this.stripe.constructEvent(body, header);

    // // Extract the object from the event.
    const dataObject = stripeEvent.data.object as Record<string, string>;

    switch (stripeEvent.type) {
      case 'invoice.payment_succeeded':
        if (dataObject['billing_reason'] == 'subscription_create') {
          await this.emitter.emitAsync(
            'subscription.payment.succeeded',
            new SubscriptionPaymentSucceededEvent(
              dataObject['subscription'],
              dataObject['payment_intent'],
            ),
          );
        }
        break;
      case 'invoice.payment_failed':
        // If the payment fails or the customer does not have a valid payment method,
        //  an invoice.payment_failed event is sent, the subscription becomes past_due.
        // Use this webhook to notify your user that their payment has
        // failed and to retrieve new card details.
        break;
      case 'invoice.finalized':
        // If you want to manually send out invoices to your customers
        // or store them locally to reference to avoid hitting Stripe rate limits.
        break;
      case 'customer.subscription.deleted':
        if (stripeEvent.request != null) {
          // handle a subscription cancelled by your request
          // from above.
        } else {
          // handle subscription cancelled automatically based
          // upon your subscription settings.
        }
        break;
      default:
      // Unexpected event type
    }
  }
}
