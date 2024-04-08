import { SubscriptionResponse } from '@/features/subscriptions';
import { User } from '@/features/users';
import { UserResponse } from '@/features/users/dto/responses/user.response';

export class UserProfileResponse extends UserResponse {
  constructor(user: User) {
    super(user);
    this.subscriptions =
      user.subscriptions
        ?.filter((subscription) => subscription.isActive)
        ?.map((subscription) => {
          return new SubscriptionResponse(subscription);
        }) ?? [];
  }

  subscriptions: SubscriptionResponse[] = [];
}
