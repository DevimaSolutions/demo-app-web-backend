import { Exclude } from 'class-transformer';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Name } from './name.embedded';

import { UserRole, UserStatus } from '@/features/auth/enums';
import { Profile } from '@/features/profiles/entities';
import { Factory } from '@/features/seeder';
import { SocialType } from '@/features/users';
import { UserSocials } from '@/features/users/entities/user-socials.entity';
import { UsersToFriends } from '@/features/users/entities/users-to-friend.entity';
import { UsersToSkills } from '@/features/users/entities/users-to-skills.entity';

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
        provider: 'shaper.us',
      })
      .toLowerCase(),
  )
  email: string;

  @Column({ type: 'varchar', nullable: false, unique: true })
  @Factory((faker, ctx) => ctx?.email.replace(/@.+/, '') + '_' + faker?.helpers.replaceSymbols())
  nickname: string;

  @Column('varchar', { name: 'phone_number', nullable: true })
  @Factory((faker) => faker?.helpers.arrayElement([null, faker?.phone.number()]))
  phoneNumber: string | null;

  @Column('varchar', { nullable: true })
  @Exclude()
  @Factory((_, ctx) => ctx?.password ?? null)
  password: string | null;

  @Column({ default: UserRole.User })
  @Factory((faker) => faker?.helpers.arrayElement(Object.values(UserRole)))
  role: UserRole;

  @Column({ default: UserStatus.Active })
  @Factory((faker) => faker?.helpers.arrayElement(Object.values(UserStatus)))
  status: UserStatus;

  @Column({ type: 'timestamp', name: 'email_verified', nullable: true, default: null })
  @Factory((faker) => faker?.helpers.arrayElement([null, faker?.date.past()]))
  emailVerified: Date | null;

  @Column({ type: 'varchar', name: 'verify_email_code', nullable: true, default: null })
  verifyEmailCode: string | null;

  @Column({ type: 'timestamp', name: 'verify_code_submitted_at', nullable: true, default: null })
  verifyCodeSubmittedAt: Date | null;

  @Column({ type: 'timestamp', name: 'verify_code_expire_at', nullable: true, default: null })
  verifyCodeExpireAt: Date | null;

  @Column({ type: 'timestamp', name: 'reset_password_submitted_at', nullable: true, default: null })
  resetPasswordSubmittedAt: Date | null;

  @OneToOne(() => Profile, (profile) => profile.user, {
    eager: true,
    nullable: true,
    cascade: true,
  })
  profile: Profile | null;

  @OneToMany(() => UserSocials, (socials) => socials.user, {
    eager: true,
    nullable: true,
    cascade: true,
  })
  socials: UserSocials[];

  @OneToMany(() => UsersToSkills, (usersToSkills) => usersToSkills.user, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  usersToSkills: UsersToSkills[];

  @OneToMany(() => UsersToFriends, (usersToFriends) => usersToFriends.user, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  usersToFriends: UsersToFriends[];

  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    name: 'updated_at',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true, default: null })
  deletedAt: Date | null;

  hasSocial(socialId: string | undefined, type: SocialType) {
    return this.socials.find((item) => item.socialId === socialId && item.type === type);
  }

  get isAdmin() {
    return this.role === UserRole.Admin;
  }
}
