import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { User } from '@/features/users/entities/user.entity';

@Entity({ name: 'energies' })
export class Energy extends BaseEntity {
  constructor(partial: Partial<Energy>) {
    super();
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', default: 3 })
  energy: number;

  @OneToOne(() => User, (user) => user.energy, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'timestamp', name: 'spent_in', nullable: true })
  spentIn: Date | null;
}
