import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { TokenScope } from '@/features/personal-token/enums';
import { User } from '@/features/users/entities';

@Entity({ name: 'user-personal-tokens' })
export class PersonalToken extends BaseEntity {
  constructor(partial: Partial<PersonalToken>) {
    super();
    Object.assign(this, partial);
  }

  @PrimaryColumn({ type: 'uuid', generated: 'uuid' })
  id: string;

  @Column('varchar', { nullable: true })
  name: string | null;

  @ManyToOne(() => User, {
    eager: true,
    cascade: ['insert', 'update'],
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column('varchar', { array: true })
  scopes: TokenScope[];

  @Column()
  revoked: boolean;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  public createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    name: 'updated_at',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  public updatedAt: Date;

  @Column('timestamp', { name: 'expires_at' })
  expiresAt: Date;
}
