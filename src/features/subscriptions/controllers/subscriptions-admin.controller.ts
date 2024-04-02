import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { Authorized, UserRole } from '@/features/auth';
import { MessageResponse } from '@/features/common';
import { CreateSubscriptionRequest, UpdateSubscriptionRequest } from '@/features/subscriptions/dto';
import { SubscriptionsService } from '@/features/subscriptions/subscriptions.service';
import {
  createSubscriptionSchema,
  updateSubscriptionSchema,
} from '@/features/subscriptions/validations';
import { JoiValidationPipe } from '@/pipes';

@ApiTags('Admin')
@Controller('admin/subscriptions')
export class SubscriptionsAdminController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get()
  @Authorized(UserRole.Admin)
  @ApiOperation({
    description:
      '### You will be able to use this operation only when the user is in the *role  admin*',
    summary: 'Get all subscriptions',
  })
  index() {
    return this.subscriptionsService.findAll();
  }

  @Get(':id')
  @Authorized(UserRole.Admin)
  @ApiOperation({
    description:
      '### You will be able to use this operation only when the user is in the *role  admin*',
    summary: 'Get a specific subscription by id',
  })
  show(@Param('id', ParseUUIDPipe) id: string) {
    return this.subscriptionsService.findOne(id);
  }

  @Post()
  @Authorized(UserRole.Admin)
  @ApiOperation({
    description:
      '### You will be able to use this operation only when the user is in the *role  admin*',
    summary: 'Create a new subscription',
  })
  create(
    @Body(new JoiValidationPipe(createSubscriptionSchema)) request: CreateSubscriptionRequest,
  ) {
    return this.subscriptionsService.create(request);
  }

  @Patch(':id')
  @Authorized(UserRole.Admin)
  @ApiOperation({
    description:
      '### You will be able to use this operation only when the user is in the *role  admin*',
    summary: 'Update a specific subscription by id',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new JoiValidationPipe(updateSubscriptionSchema)) request: UpdateSubscriptionRequest,
  ) {
    return this.subscriptionsService.update(id, request);
  }

  @Delete(':id')
  @Authorized(UserRole.Admin)
  @ApiOperation({
    description:
      '### You will be able to use this operation only when the user is in the *role  admin*',
    summary: 'Remove a specific subscription by id',
  })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<MessageResponse> {
    return this.subscriptionsService.remove(id);
  }
}
