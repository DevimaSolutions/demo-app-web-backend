import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

import { FileEntity } from '@/features/files/entities';
import { Gender, ProfileType, LearningPace } from '@/features/profiles/enums';
import { Factory } from '@/features/seeder';
import { User } from '@/features/users/entities';

@Entity({ name: 'user_profiles' })
export class Profile extends BaseEntity {
  constructor(partial: Partial<Profile>) {
    super();
    Object.assign(this, partial);
  }

  @PrimaryColumn({ type: 'uuid', generated: 'uuid' })
  id: string;

  @Column('varchar', { name: 'phone_number', nullable: true })
  @Factory<Profile>((faker) => faker.phone.number())
  phoneNumber: string | null;

  @Column({ type: 'int', nullable: true })
  @Factory<Profile>((faker) => faker.helpers.rangeToNumber({ min: 13, max: 50 }))
  age: number | null;

  @Column({ type: 'enum', enum: Gender, nullable: true })
  @Factory<Profile>((faker) => faker.helpers.arrayElement(Object.values(Gender)))
  gender: Gender | null;

  @Column({ type: 'enum', enum: ProfileType, name: 'profile_type', nullable: true })
  @Factory<Profile>((faker) => faker.helpers.arrayElement(Object.values(ProfileType)))
  profileType: ProfileType | null;

  @Column({ type: 'enum', enum: LearningPace, name: 'learning_pace', nullable: true })
  @Factory<Profile>((faker) => faker.helpers.arrayElement(Object.values(LearningPace)))
  learningPace: LearningPace | null;

  @OneToOne(() => User, (user) => user.profile, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToOne(() => FileEntity, {
    eager: true,
    nullable: true,
    cascade: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'file_id' })
  profileImage: FileEntity | null;
}
