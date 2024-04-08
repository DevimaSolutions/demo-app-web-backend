import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

import { StripeSubscriptionMetadata } from '@/features/subscriptions/entities/stripe-subscription.metadata';
import { SubscriptionPaymentMethod, SubscriptionType } from '@/features/subscriptions/enums';
import { User } from '@/features/users/entities/user.entity';

@Entity({ name: 'user_subscriptions' })
export class Subscription extends BaseEntity {
  constructor(partial: Partial<Subscription>) {
    super();
    Object.assign(this, partial);
  }

  @PrimaryColumn({ type: 'uuid', generated: 'uuid' })
  id: string;

  @ManyToOne(() => User, (user) => user.profile, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'json', nullable: true })
  metadata: StripeSubscriptionMetadata | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column()
  paymentMethod: SubscriptionPaymentMethod;

  @Column()
  type: SubscriptionType;

  @Column()
  name: string;

  @Column({
    type: 'timestamp',
    name: 'start_at',
  })
  startAt: Date;

  @Column({
    type: 'timestamp',
    name: 'end_at',
  })
  endAt: Date;

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
  get isActive() {
    return this.endAt >= new Date();
  }
}
