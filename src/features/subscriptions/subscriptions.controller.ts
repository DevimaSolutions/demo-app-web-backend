import { Controller, Get, Param, Post, Delete, Req, Body } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

import { Authorized } from '@/features/auth';
import { IRequestWithUser } from '@/features/auth/interfaces';
import { MessageResponse } from '@/features/common';
import { StripeCreateSubscriptionSessionRequest } from '@/features/subscriptions/dto';
import { SubscriptionsService } from '@/features/subscriptions/subscriptions.service';
import { stripeCreateSubscriptionSessionSchema } from '@/features/subscriptions/validations';
import { JoiValidationPipe } from '@/pipes';

@ApiTags('Subscriptions')
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get('stripe')
  @Authorized()
  @ApiOperation({
    summary: 'Get all subscriptions',
  })
  index() {
    return this.subscriptionsService.findAll();
  }

  @Post('stripe/session')
  @Authorized()
  @ApiOperation({
    summary: 'Create subscription session',
    description: '',
    externalDocs: {
      description: 'Stripe build a subscriptions integration',
      url: 'https://docs.stripe.com/billing/subscriptions/build-subscriptions?platform=web&ui=elements#create-subscription',
    },
  })
  create(
    @Req() req: IRequestWithUser,
    @Body(new JoiValidationPipe(stripeCreateSubscriptionSessionSchema))
    request: StripeCreateSubscriptionSessionRequest,
  ) {
    return this.subscriptionsService.createSession(req.user, request);
  }

  @Delete('stripe/:id')
  @Authorized()
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'stripe price id',
  })
  @ApiOperation({
    summary: 'Cancel automatic subscription renewal',
    description: '',
  })
  cancel(@Req() req: IRequestWithUser, @Param('id') id: string): Promise<MessageResponse> {
    return this.subscriptionsService.cancel(req.user, id);
  }
}
