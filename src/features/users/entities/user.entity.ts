import { Exclude } from 'class-transformer';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Name } from './name.embedded';

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

  @Column(() => Name, { prefix: 'name' })
  @Factory((faker) => ({ first: faker?.person.firstName(), last: faker?.person.lastName() }))
  name: Name;

  @Column({ unique: true })
  @Factory((faker, ctx) =>
    faker?.internet
      .email({
        firstName: ctx?.name.first ?? faker?.person.firstName(),
        lastName: ctx?.name.last ?? faker?.person.lastName(),
      })
      .toLowerCase(),
  )
  email: string;

  @Column('varchar', { name: 'phone_number', nullable: true })
  @Factory((faker) => faker?.helpers.arrayElement([null, faker?.phone.number()]))
  phoneNumber: string | null;

  @Column('varchar', { nullable: true })
  @Exclude()
  @Factory((_, ctx) => ctx?.password ?? null)
  password: string | null;

  @Column()
  @Factory((faker) => faker?.helpers.arrayElement([0, 1]))
  role: UserRole;

  @Column({ default: UserStatus.Active })
  @Factory((faker) => faker?.helpers.arrayElement([0, 1, 2]))
  status: UserStatus;

  @Column({ type: 'timestamp', name: 'email_verified', nullable: true, default: null })
  @Factory((faker) => faker?.helpers.arrayElement([null, faker?.date.past()]))
  public emailVerified: Date | null;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    name: 'updated_at',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updatedAt: Date;
}
