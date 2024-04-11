import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { subMinutes } from 'date-fns';
import { IsNull, LessThan, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';

import { UserStatus } from '@/features/auth';
import { energyConstants } from '@/features/common';
import { UsersRepository } from '@/features/users/repositoies';

@Injectable()
export class EnergyTasksService {
  constructor(private readonly usersRepository: UsersRepository) {}
  @Cron('* * * * * *')
  async handleCron() {
    const users = (
      await Promise.all([
        this.usersRepository.find({
          where: {
            status: UserStatus.Active,
            energy: {
              energy: LessThan(energyConstants.maxPoints),
              spentIn: LessThanOrEqual(subMinutes(new Date(), energyConstants.recoveryMinutes)),
            },
            subscriptions: [{ endAt: LessThan(new Date()) }, { endAt: IsNull() }],
          },
          relations: { subscriptions: true, energy: true },
        }),
        this.usersRepository.find({
          where: {
            status: UserStatus.Active,
            energy: {
              energy: LessThan(energyConstants.maxPremiumPoints),
              spentIn: LessThanOrEqual(
                subMinutes(new Date(), energyConstants.recoveryPremiumMinutes),
              ),
            },
            subscriptions: { endAt: MoreThanOrEqual(new Date()) },
          },
          relations: { subscriptions: true, energy: true },
        }),
      ])
    ).flat();

    for (const user of users) {
      const hasPremium = user.findActiveSubscriptionType();

      const maxPoints = hasPremium ? energyConstants.maxPremiumPoints : energyConstants.maxPoints;
      user.energy.energy += 1;
      if (user.energy.energy < maxPoints) {
        user.energy.spentIn = new Date();
      }
      if (user.energy.energy >= maxPoints) {
        user.energy.energy = maxPoints;
        user.energy.spentIn = null;
      }

      await this.usersRepository.save(user);
    }
  }
}
