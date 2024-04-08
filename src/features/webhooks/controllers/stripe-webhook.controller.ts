import { Controller, Post, Req, RawBodyRequest } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { StripeWebhookService } from '@/features/webhooks/services';

@ApiTags('Webhooks')
@Controller('webhooks')
export class StripeWebhookController {
  constructor(private readonly service: StripeWebhookService) {}
  @Post('stripe')
  @ApiOperation({
    summary: 'Receive Stripe events in webhook endpoint',
  })
  async webhook(@Req() request: RawBodyRequest<Request>) {
    return this.service.handelStripeWebhook(
      request.rawBody as Buffer,
      request.header('Stripe-Signature') ?? '',
    );
  }
}
