import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

import { FileEntity } from '@/features/files/entities';
import { Gender, ProfileType, LearningPace } from '@/features/profiles/enums';
import { User } from '@/features/users/entities';

@Entity({ name: 'user_profiles' })
export class Profile extends BaseEntity {
  constructor(partial: Partial<Profile>) {
    super();
    Object.assign(this, partial);
  }

  @PrimaryColumn({ type: 'uuid', generated: 'uuid' })
  id: string;

  @Column({ type: 'int', nullable: true })
  age: number | null;

  @Column({ type: 'enum', enum: Gender, nullable: true })
  gender: Gender | null;

  @Column({ type: 'enum', enum: ProfileType, name: 'profile_type', nullable: true })
  profileType: ProfileType | null;

  @Column({ type: 'enum', enum: LearningPace, name: 'learning_pace', nullable: true })
  learningPace: LearningPace | null;

  @Column({ name: 'is_onboarding_completed', default: false })
  isOnboardingCompleted: boolean;

  @OneToOne(() => User, (user) => user.profile, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => FileEntity, {
    eager: true,
    nullable: true,
    cascade: ['insert', 'update'],
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'file_id' })
  profileImage: FileEntity | null;
}
