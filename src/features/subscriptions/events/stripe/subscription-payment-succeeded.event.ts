export class SubscriptionPaymentSucceededEvent {
  constructor(subscriptionId: string, paymentIntentId: string) {
    this.subscriptionId = subscriptionId;
    this.paymentIntentId = paymentIntentId;
  }

  subscriptionId: string;
  paymentIntentId: string;
}
