import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { User } from './user.entity';

@Entity({ name: 'user_progress' })
export class UserProgress extends BaseEntity {
  constructor(partial: Partial<UserProgress>) {
    super();
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', nullable: false, default: 1 })
  level: number;

  @Column({ type: 'int', nullable: false, default: 1000 })
  experience: number;

  @OneToOne(() => User, (user) => user.progress, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
