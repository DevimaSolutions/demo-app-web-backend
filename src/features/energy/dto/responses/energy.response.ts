import { addMinutes } from 'date-fns';

import { energyConstants } from '@/features/common';
import { Energy } from '@/features/energy/entities';
import { User } from '@/features/users/entities';

export class EnergyResponse {
  constructor(entity: Energy | User) {
    Object.assign(this, this.generateObject(entity));
  }

  userId: string;

  energy: number;

  fullRecoveryIn: Date | null;

  private generateObject(entity: Energy | User) {
    const energy = entity instanceof User ? entity.energy : entity;
    const user = entity instanceof User ? entity : entity.user;

    return {
      userId: user.id,
      energy: energy.energy,
      fullRecoveryIn: this.calculateRecoveryTime(energy, user),
    };
  }

  private calculateRecoveryTime(energy: Energy, user: User) {
    const hasPremium = user.findActiveSubscriptionType();

    const maxPoints = hasPremium ? energyConstants.maxPremiumPoints : energyConstants.maxPoints;

    if (!energy.spentIn && energy.energy < maxPoints) {
      return null;
    }

    const recoveryMinutes = hasPremium
      ? energyConstants.recoveryPremiumMinutes
      : energyConstants.recoveryMinutes;

    const multiple = maxPoints - energy.energy;

    return addMinutes(energy.spentIn as Date, recoveryMinutes * multiple);
  }
}
