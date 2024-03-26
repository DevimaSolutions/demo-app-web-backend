import { addMilliseconds } from 'date-fns';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

import { User } from '@/features/users/entities/user.entity';
import { VerificationTokenType } from '@/features/users/enums/verification-token-type.enum';

@Entity({ name: 'users_verification_tokens' })
@Index(['user', 'type'], { unique: true })
export class UsersVerificationToken extends BaseEntity {
  constructor(partial: Partial<UsersVerificationToken>) {
    super();
    Object.assign(this, partial);
  }

  @PrimaryColumn({ type: 'uuid', generated: 'uuid' })
  id: string;

  @ManyToOne(() => User, (user) => user.tokens, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  public user: User;

  @Column()
  type: VerificationTokenType;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'submitted_at',
  })
  submittedAt: Date;

  @Column('varchar', { nullable: true })
  token: string | null;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'expire_at',
    nullable: true,
  })
  expireAt: Date | null;

  static makeVerifyEmail(id: string | undefined, token: string, expire: number) {
    return new UsersVerificationToken({
      id,
      type: VerificationTokenType.VerifyEmail,
      token,
      submittedAt: new Date(),
      expireAt: addMilliseconds(new Date(), expire),
    });
  }

  static makePasswordReset(id: string | undefined) {
    return new UsersVerificationToken({
      id,
      type: VerificationTokenType.PasswordReset,
      submittedAt: new Date(),
    });
  }

  get isPasswordReset() {
    return this.type === VerificationTokenType.PasswordReset;
  }
  get isVerifyEmail() {
    return this.type === VerificationTokenType.VerifyEmail;
  }
}
