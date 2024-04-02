import { Injectable } from '@nestjs/common';

import { successMessages } from '@/features/common';
import {
  CreateSubscriptionRequest,
  SubscriptionResponse,
  UpdateSubscriptionRequest,
} from '@/features/subscriptions';
import { SubscriptionsRepository } from '@/features/subscriptions/repositoies';

@Injectable()
export class SubscriptionsService {
  constructor(private readonly subscriptionsRepository: SubscriptionsRepository) {}

  async create(request: CreateSubscriptionRequest) {
    const subscription = await this.subscriptionsRepository.save(request);
    return new SubscriptionResponse(subscription);
  }

  async findAll() {
    const subscriptions = await this.subscriptionsRepository.find();

    return subscriptions.map((subscription) => new SubscriptionResponse(subscription));
  }

  async findOne(id: string) {
    const subscription = await this.subscriptionsRepository.getOne(id);
    return new SubscriptionResponse(subscription);
  }

  async update(id: string, request: UpdateSubscriptionRequest) {
    const subscription = await this.subscriptionsRepository.getOne(id);
    await this.subscriptionsRepository.update(id, request);
    return new SubscriptionResponse(subscription);
  }

  async remove(id: string) {
    const subscription = await this.subscriptionsRepository.getOne(id);

    await this.subscriptionsRepository.softRemove(subscription);
    return { message: successMessages.success };
  }
}
