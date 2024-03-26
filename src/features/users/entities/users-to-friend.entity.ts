import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

import { User } from '@/features/users/entities/user.entity';

@Entity('users_friends')
export class UsersToFriends extends BaseEntity {
  constructor(partial: Partial<UsersToFriends>) {
    super();
    Object.assign(this, partial);
  }
  @PrimaryColumn({ type: 'uuid', generated: 'uuid', name: 'user_id' })
  public userId: string;

  @PrimaryColumn({ type: 'uuid', generated: 'uuid', name: 'friend_id' })
  public friendId: string;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
  })
  public createdAt: Date;

  @ManyToOne(() => User, (user) => user.usersToFriends, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  public user: User;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'friend_id', referencedColumnName: 'id' })
  public friend: User;
}
