import { Injectable } from '@nestjs/common';

import { StripeService } from '@/features/payments/services/stripe.service';

@Injectable()
export class PaymentsService {
  constructor(private readonly _stripe: StripeService) {}
}
