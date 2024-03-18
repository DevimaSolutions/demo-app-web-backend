import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

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
}
