import { Exclude } from 'class-transformer';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Name } from './name.embedded';
import { UserProgress } from './user-progress.entity';

import { UserRole, UserStatus } from '@/features/auth/enums';
import { Profile } from '@/features/profiles/entities';
import { Factory } from '@/features/seeder';
import { Subscription } from '@/features/subscriptions/entities/subscription.entity';
import { SubscriptionType } from '@/features/subscriptions/enums';
import { SocialType } from '@/features/users';
import { UserSocials } from '@/features/users/entities/user-socials.entity';
import { UsersToFriends } from '@/features/users/entities/users-to-friend.entity';
import { UsersToSkills } from '@/features/users/entities/users-to-skills.entity';
import { UsersVerificationToken } from '@/features/users/entities/users-verification-token.entity';

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

  @Column({ unique: true })
  @Factory((faker, ctx) => ctx?.email.replace(/@.+/, '') + '_' + faker?.helpers.replaceSymbols())
  nickname: string;

  @Column('varchar', { nullable: true })
  @Exclude()
  @Factory((_, ctx) => ctx?.password ?? null)
  password: string | null;

  @Column({ default: UserRole.User })
  @Factory((faker) => faker?.helpers.arrayElement(Object.values(UserRole)))
  role: UserRole;

  @Column({ default: UserStatus.Pending })
  @Factory((faker) => faker?.helpers.arrayElement(Object.values(UserStatus)))
  status: UserStatus;

  @OneToOne(() => Profile, (profile) => profile.user, {
    eager: true,
    nullable: true,
    cascade: true,
  })
  profile: Profile | null;

  @OneToOne(() => UserProgress, (progress) => progress.user, {
    eager: true,
    cascade: true,
  })
  progress: UserProgress;

  @OneToMany(() => Subscription, (subscription) => subscription.user, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  subscriptions: Subscription[];

  @OneToMany(() => UserSocials, (socials) => socials.user, {
    cascade: true,
  })
  socials: UserSocials[];

  @OneToMany(() => UsersToSkills, (usersToSkills) => usersToSkills.user, {
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

  @OneToMany(() => UsersVerificationToken, (token) => token.user, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  tokens: UsersVerificationToken[];

  @Column({ type: 'timestamp', name: 'email_verified', nullable: true, default: null })
  @Factory((faker) => faker?.helpers.arrayElement([null, faker?.date.past()]))
  emailVerified: Date | null;

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

  hasSocial(socialId: string | undefined, type: SocialType) {
    return this.socials.find((item) => item.socialId === socialId && item.type === type);
  }

  getSocialByType(type: SocialType) {
    return this.socials.find((item) => item.type === type);
  }

  get isBlocked() {
    return this.status === UserStatus.Blocked;
  }

  get isVerified() {
    return this.status === UserStatus.Verified;
  }

  get isPending() {
    return this.status === UserStatus.Pending;
  }

  get isActive() {
    return this.status === UserStatus.Active;
  }

  get isAdmin() {
    return this.role === UserRole.Admin;
  }

  findActiveSubscriptionType(type: SubscriptionType = SubscriptionType.Premium) {
    return this.subscriptions?.find(
      (subscription) => subscription.type === type && subscription.isActive,
    );
  }
}
