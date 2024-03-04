import { Exclude } from 'class-transformer';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

import { UserRole, UserStatus } from '@/features/auth/enums';
import { Factory } from '@/features/seeder';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  constructor(partial: Partial<User>) {
    super();
    Object.assign(this, partial);
  }

  @PrimaryColumn({ type: 'uuid', generated: 'uuid' })
  id: string;

  @Factory((faker) => faker?.internet.email().toLowerCase())
  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  @Factory('')
  password: string;

  @Column()
  @Factory((faker) => faker?.helpers.arrayElement([0, 1]))
  role: UserRole;

  @Column({ default: UserStatus.Active })
  @Factory((faker) => faker?.helpers.arrayElement([0, 1, 2]))
  status: UserStatus;
}
