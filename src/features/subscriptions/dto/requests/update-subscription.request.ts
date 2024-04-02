import { PartialType } from '@nestjs/swagger';

import { CreateSubscriptionRequest } from '@/features/subscriptions/dto/requests/create-subscription.request';

export class UpdateSubscriptionRequest extends PartialType(CreateSubscriptionRequest) {}
