import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { DataSource, In, Repository } from 'typeorm';

import { Seeder } from '@/features/seeder';
import { DataFactory } from '@/features/seeder';
import { User } from '@/features/users/entities';

@Injectable()
export class UsersSeeder implements Seeder {
  private readonly repository: Repository<User>;
  constructor(protected readonly connection: DataSource) {
    this.repository = connection.getRepository(User);
  }
  async seed(): Promise<any> {
    const users = DataFactory.createForClass(User).generate(20, {
      password: await bcrypt.hash('secret', bcrypt.genSaltSync()),
    });
    await this.repository.save(users);
  }

  async drop(): Promise<any> {
    const users = await this.repository.find();
    await this.repository.delete({ id: In(users.map((item) => item.id)) });
  }
}
