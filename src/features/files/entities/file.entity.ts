import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'files' })
export class FileEntity extends BaseEntity {
  constructor(partial: Partial<FileEntity>) {
    super();
    Object.assign(this, partial);
  }

  @PrimaryColumn({ type: 'uuid', generated: 'uuid' })
  id: string;

  @Index()
  @Column({ unique: true })
  name: string;

  @Column()
  path: string;

  @Column()
  mimetype: string;

  @Column()
  size: number;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    name: 'updated_at',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  public updatedAt: Date;
}
