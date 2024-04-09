import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import Stripe from 'stripe';

import { errorMessages, successMessages } from '@/features/common';
import { StripeService } from '@/features/payments/services/stripe.service';
import {
  StripeCreateSubscriptionResponse,
  StripeCreateSubscriptionSessionRequest,
  StripeSubscriptionResponse,
} from '@/features/subscriptions';
import { StripeSubscriptionSessionResponse } from '@/features/subscriptions/dto/responses/stripe-subscription-session.response';
import { SubscriptionPaymentMethod, SubscriptionType } from '@/features/subscriptions/enums';
import { User } from '@/features/users';

@Injectable()
export class SubscriptionsService {
  constructor(private readonly stripe: StripeService) {}

  async create(user: User, priceId: string) {
    const price = await this.stripe.priceRetrieve(priceId);

    if (
      user.findActiveSubscriptionType(
        (price.product as Stripe.Product).metadata.type as SubscriptionType,
      )
    ) {
      throw new BadRequestException(errorMessages.subscriptionIsActive);
    }
    const customer = await this.stripe.findOrCreateCustomer(user.name, user.email);

    const subscription = await this.stripe.subscriptionCreate(user.id, customer.id, price.id);

    const clientSecret = (
      (subscription.latest_invoice as Stripe.Invoice).payment_intent as Stripe.PaymentIntent
    ).client_secret as string;
    return new StripeCreateSubscriptionResponse(subscription.id, clientSecret);
  }

  async createSession(user: User, request: StripeCreateSubscriptionSessionRequest) {
    const price = await this.stripe.priceRetrieve(request.stripPriceId);

    if (
      user.findActiveSubscriptionType(
        (price.product as Stripe.Product).metadata.type as SubscriptionType,
      )
    ) {
      throw new BadRequestException(errorMessages.subscriptionIsActive);
    }

    const session = await this.stripe.createSession(user, request);

    if (!session.url) {
      throw new BadRequestException();
    }
    return new StripeSubscriptionSessionResponse(session.url);
  }

  async cancel(user: User, priceId: string) {
    const price = await this.stripe.priceRetrieve(priceId);
    const subscription = user.findActiveSubscriptionType(
      (price.product as Stripe.Product).metadata.type as SubscriptionType,
    );
    if (
      !subscription ||
      subscription.paymentMethod !== SubscriptionPaymentMethod.Stripe ||
      !subscription.metadata?.subscriptionId
    ) {
      throw new NotFoundException();
    }

    await this.stripe.subscriptionCancel(subscription.metadata.subscriptionId);

    return { message: successMessages.success };
  }

  async findAll() {
    const { data } = await this.stripe.getPricesList();
    return data.map((subscription) => new StripeSubscriptionResponse(subscription));
  }
}
