import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

import { SubscriptionType } from '@/features/subscriptions/enums/subscription-type.enum';

@Entity({ name: 'subscriptions' })
export class Subscription extends BaseEntity {
  constructor(partial: Partial<Subscription>) {
    super();
    Object.assign(this, partial);
  }

  @PrimaryColumn({ type: 'uuid', generated: 'uuid' })
  id: string;

  @Column()
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column()
  description: string;

  @Column()
  type: SubscriptionType;

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
}
