import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { Authorized } from '@/features/auth';
import { SubscriptionsService } from '@/features/subscriptions/subscriptions.service';

@ApiTags('Subscriptions')
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get()
  @Authorized()
  @ApiOperation({
    summary: 'Get all subscriptions',
  })
  index() {
    return this.subscriptionsService.findAll();
  }
}
