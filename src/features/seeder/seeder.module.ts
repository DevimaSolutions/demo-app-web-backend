import { Module, DynamicModule, Type } from '@nestjs/common';
import { Repository } from 'typeorm';

import { SeederService } from './seeder.service';

import { Seeder, ISeederModuleOptions } from '@/features/seeder/interfaces';

@Module({})
export class SeederModule {
  static forRoot(options: ISeederModuleOptions): DynamicModule {
    return {
      module: SeederModule,
      imports: options.imports || [],
      providers: [
        ...(options.providers || []),
        ...options.seeders,
        {
          provide: SeederService,
          useFactory: (...seeders: Seeder[]): SeederService => {
            return new SeederService(seeders);
          },
          inject: options.seeders as Type[],
        },
        Repository,
      ],
      exports: [...(options?.exports ?? []), SeederService],
    };
  }
}
