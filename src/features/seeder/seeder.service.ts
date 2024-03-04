import { Injectable } from '@nestjs/common';

import { Seeder } from '@/features/seeder';

@Injectable()
export class SeederService {
  constructor(private readonly seeders: Seeder[]) {}

  async run(refresh?: boolean, className?: string): Promise<any> {
    return this.seed(refresh, className);
  }

  async seed(refresh?: boolean, className?: string): Promise<any> {
    if (className) {
      return await this.seedOne(className, refresh);
    }

    return this.seedAll(refresh);
  }

  async seedOne(className: string, refresh?: boolean) {
    const seeder = this.seeders.find((item) => item.constructor.name === className);

    if (!seeder) {
      throw new Error(`Seeder ${className} not found`);
    }

    if (refresh) await seeder.drop();
    await seeder.seed();
    console.log(`${seeder.constructor.name} completed`);
  }

  async seedAll(refresh?: boolean) {
    if (refresh) await this.dropAll();

    // Don't use `Promise.all` during insertion.
    // `Promise.all` will run all promises in parallel which is not what we want.
    for (const seeder of this.seeders) {
      await seeder.seed();
      console.log(`${seeder.constructor.name} completed`);
    }
  }

  async dropAll(): Promise<any> {
    return Promise.all(this.seeders.map((seeder) => seeder.drop()));
  }
}
