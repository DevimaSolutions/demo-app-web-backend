import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

import { UsersToSkills } from '@/features/user-to-skills/entities';

@Entity({ name: 'soft_skills' })
export class SoftSkill extends BaseEntity {
  constructor(partial: Partial<SoftSkill>) {
    super();
    Object.assign(this, partial);
  }

  @PrimaryColumn({ type: 'uuid', generated: 'uuid' })
  @ApiProperty()
  id: string;

  @Column({ unique: true })
  @ApiProperty()
  name: string;

  @OneToMany(() => UsersToSkills, (usersToSkills) => usersToSkills.softSkill, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @ApiHideProperty()
  @Exclude()
  public usersToSkills: UsersToSkills[];
}
