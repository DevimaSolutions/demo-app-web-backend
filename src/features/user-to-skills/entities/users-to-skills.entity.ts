import { CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { SoftSkill } from '@/features/soft-skills/entities';
import { User } from '@/features/users/entities';

@Entity('users_soft_skills')
export class UsersToSkills {
  @PrimaryColumn({ type: 'uuid', generated: 'uuid', name: 'user_id' })
  public userId: string;

  @PrimaryColumn({ type: 'uuid', generated: 'uuid', name: 'soft_skill_id' })
  public softSkillId: string;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
  })
  public createdAt: Date;

  @ManyToOne(() => User, (user) => user.usersToSkills)
  @JoinColumn({ name: 'user_id' })
  public user: User;

  @ManyToOne(() => SoftSkill, (softSkill) => softSkill.usersToSkills)
  @JoinColumn({ name: 'soft_skill_id' })
  public softSkill: SoftSkill;
}
