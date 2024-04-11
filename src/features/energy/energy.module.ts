import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EnergyController } from './energy.controller';

import { EnergyRepository } from '@/features/energy/energy.repository';
import { Energy } from '@/features/energy/entities';
import { EnergyService, EnergyTasksService } from '@/features/energy/services';
import { UsersRepository } from '@/features/users/repositoies/users.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Energy])],
  providers: [EnergyService, EnergyTasksService, UsersRepository, EnergyRepository],
  controllers: [EnergyController],
})
export class EnergyModule {}
