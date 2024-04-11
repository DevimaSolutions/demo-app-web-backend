import { EnergyResponse } from '@/features/energy/dto/responses';
import { SubscriptionResponse } from '@/features/subscriptions';
import { User } from '@/features/users';
import { UserResponse } from '@/features/users/dto/responses/user.response';

export class UserProfileResponse extends UserResponse {
  constructor(user: User) {
    super(user);
    this.diamonds = user.diamonds;
    this.subscriptions =
      user.subscriptions
        ?.filter((subscription) => subscription.isActive)
        ?.map((subscription) => {
          return new SubscriptionResponse(subscription);
        }) ?? [];

    this.energy = new EnergyResponse(user);
  }

  diamonds: number;

  subscriptions: SubscriptionResponse[] = [];

  energy: EnergyResponse;
}
