import { BadRequestException, Injectable } from '@nestjs/common';

import { EnergyResponse } from '@/features/energy';
import { EnergyRepository } from '@/features/energy/energy.repository';

@Injectable()
export class EnergyService {
  constructor(private readonly energyRepository: EnergyRepository) {}
  async decrement(userId: string) {
    const energy = await this.energyRepository.getOneByWithRelations(
      { user: { id: userId } },
      { user: { subscriptions: true } },
    );

    if (energy.energy <= 0) {
      throw new BadRequestException();
    }

    energy.energy -= 1;
    energy.spentIn = energy.spentIn ?? new Date();
    const result = await energy.save();

    return new EnergyResponse(result);
  }
}
