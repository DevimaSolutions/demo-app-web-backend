import { DynamicModule, ForwardReference, Provider, Type } from '@nestjs/common';

import { Seeder } from '@/features/seeder';

export interface ISeederModuleOptions {
  seeders: Provider<Seeder>[];
  imports?: Array<Type | DynamicModule | Promise<DynamicModule> | ForwardReference>;
  providers?: Provider[];
  exports?: Provider[];
}
