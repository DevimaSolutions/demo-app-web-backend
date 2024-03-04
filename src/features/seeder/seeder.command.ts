import { Injectable } from '@nestjs/common';
import { Command, Option } from 'nestjs-command';

import { SeederService } from '@/features/seeder';
@Injectable()
export class SeederCommand {
  constructor(private readonly seederService: SeederService) {}

  @Command({
    command: 'db:seed',
    describe: 'Run the database seeders',
  })
  async create(
    @Option({
      name: 'refresh',
      describe: 'Replace existing data',
      type: 'boolean',
      alias: 'r',
      default: false,
    })
    refresh: boolean,
    @Option({
      name: 'class',
      describe: 'Specify a specific seeder class to run individually',
      type: 'string',
      alias: 'c',
    })
    className: string,
  ) {
    await this.seederService.run(refresh, className);
  }
}
