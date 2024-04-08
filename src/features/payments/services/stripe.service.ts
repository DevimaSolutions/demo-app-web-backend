import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

import { StripeCreateSubscriptionSessionRequest } from '@/features/subscriptions';
import { User } from '@/features/users';

@Injectable()
export class StripeService {
  private stripe;

  constructor(private readonly config: ConfigService) {
    const { apiKey, apiVersion } = config.get('stripe');
    this.stripe = new Stripe(apiKey, { apiVersion });
  }

  async getPricesList() {
    return this.stripe.prices.list({
      expand: ['data.product'],
    });
  }

  async subscriptionCreate(userId: string, customer: string, price: string) {
    return this.stripe.subscriptions.create({
      customer,
      items: [{ price }],
      metadata: { userId },
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
    });
  }

  async createSession(user: User, request: StripeCreateSubscriptionSessionRequest) {
    try {
      const customer = await this.findOrCreateCustomer(user.name.full, user.email);

      return await this.stripe.checkout.sessions.create({
        billing_address_collection: 'auto',
        customer: customer.id,
        line_items: [
          {
            price: request.stripPriceId,
            quantity: 1,
          },
        ],
        subscription_data: {
          metadata: { userId: user.id },
        },
        mode: 'subscription',
        success_url: request.successUrl,
        cancel_url: request.cancelUrl,
      });
    } catch (e) {
      throw new BadRequestException();
    }
  }

  constructEvent(body: string | Buffer, header: string) {
    try {
      return this.stripe.webhooks.constructEvent(
        body,
        header,
        this.config.get<string>('stripe.webhookSecret', ''),
      );
    } catch (err) {
      throw new BadRequestException();
    }
  }

  async findOrCreateCustomer(name: string, email: string) {
    const customer = await this.stripe.customers
      .search({
        query: `email: '${email}'`,
      })
      .then(({ data }) => data?.[0] ?? null);

    if (customer) {
      return customer;
    }

    return this.stripe.customers.create({
      name,
      email,
    });
  }

  async paymentIntentRetrieve(paymentIntentId: string) {
    return this.stripe.paymentIntents.retrieve(paymentIntentId);
  }

  async subscriptionRetrieve(subscriptionId: string) {
    return this.stripe.subscriptions.retrieve(subscriptionId, {
      expand: ['items.data.plan.product'],
    });
  }

  async subscriptionUpdate(subscriptionId: string, data: Stripe.SubscriptionUpdateParams) {
    return this.stripe.subscriptions.update(subscriptionId, data);
  }

  async subscriptionCancel(subscriptionId: string) {
    return this.stripe.subscriptions.cancel(subscriptionId);
  }

  async priceRetrieve(priceId: string) {
    try {
      return await this.stripe.prices.retrieve(priceId, { expand: ['product'] });
    } catch {
      throw new BadRequestException();
    }
  }
}
