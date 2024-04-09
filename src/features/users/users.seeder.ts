import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { DataSource, In, Repository } from 'typeorm';

import { UserStatus } from '@/features/auth';
import { Profile } from '@/features/profiles';
import { DataFactory, Seeder } from '@/features/seeder';
import { SoftSkill } from '@/features/soft-skills';
import { User } from '@/features/users/entities';
import { UsersToSkills } from '@/features/users/entities/users-to-skills.entity';
import { HasherService } from '@/features/users/services';

@Injectable()
export class UsersSeeder implements Seeder {
  private readonly repository: Repository<User>;
  constructor(protected readonly connection: DataSource, private readonly hasher: HasherService) {
    this.repository = connection.getRepository(User);
  }
  async seed(): Promise<any> {
    const users = DataFactory.createForClass(User).generate(20, {
      password: await this.hasher.hash('secret'),
    });

    for (const user of users) {
      if (user.status === UserStatus.Active) {
        const repo = this.connection.getRepository(SoftSkill);
        user.profile = DataFactory.createForClass(Profile).generate(1)[0];
        const skills = await repo.find();
        const usersToSkills = new UsersToSkills();
        usersToSkills.softSkillId = faker.helpers.arrayElement(skills).id;
        user.usersToSkills = [usersToSkills];
      }
    }

    await this.repository.save(users);
  }

  async drop(): Promise<any> {
    const users = await this.repository.find();
    await this.repository.delete({ id: In(users.map((item) => item.id)) });
  }
}
