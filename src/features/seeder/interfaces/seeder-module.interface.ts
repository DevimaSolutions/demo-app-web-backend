import { DynamicModule, ForwardReference, Provider, Type } from '@nestjs/common';

import { Seeder } from '@/features/seeder';

export interface SeederModuleOptions {
  seeders: Provider<Seeder>[];
  imports?: Array<Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference>;
  providers?: Provider[];
  exports?: Provider[];
}
