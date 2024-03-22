import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { User } from './user.entity';

@Entity({ name: 'user_socials' })
export class UserSocials extends BaseEntity {
  constructor(partial: Partial<UserSocials>) {
    super();
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', name: 'google_id', unique: true, nullable: true, default: null })
  googleId?: string | null;

  @Column({ type: 'varchar', name: 'linkedin_id', unique: true, nullable: true, default: null })
  linkedinId?: string | null;

  @OneToOne(() => User, (user) => user.socials, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
