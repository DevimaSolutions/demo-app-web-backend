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

  maxPoints: number;

  recoveryMinutes: number;

  fullRecoveryIn: Date | null;

  private generateObject(entity: Energy | User) {
    const energy = entity instanceof User ? entity.energy : entity;
    const user = entity instanceof User ? entity : entity.user;

    const hasPremium = user.findActiveSubscriptionType();

    const maxPoints = hasPremium ? energyConstants.maxPremiumPoints : energyConstants.maxPoints;

    const recoveryMinutes = hasPremium
      ? energyConstants.recoveryPremiumMinutes
      : energyConstants.recoveryMinutes;

    return {
      userId: user.id,
      energy: energy.energy,
      recoveryMinutes,
      maxPoints,
      fullRecoveryIn: this.calculateRecoveryTime(energy, maxPoints, recoveryMinutes),
    };
  }

  private calculateRecoveryTime(energy: Energy, maxPoints: number, recoveryMinutes: number) {
    if (!energy.spentIn && energy.energy < maxPoints) {
      return null;
    }

    const multiple = maxPoints - energy.energy;

    return addMinutes(energy.spentIn as Date, recoveryMinutes * multiple);
  }
}
