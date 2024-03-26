import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { User } from './user.entity';

import { SocialType } from '@/features/users/enums/social-type.enum';

@Entity({ name: 'user_socials' })
export class UserSocials extends BaseEntity {
  constructor(partial: Partial<UserSocials>) {
    super();
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', name: 'social_id', unique: true })
  socialId: string;

  @Column({ type: 'enum', enum: SocialType })
  type: SocialType;

  @ManyToOne(() => User, (user) => user.socials, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
