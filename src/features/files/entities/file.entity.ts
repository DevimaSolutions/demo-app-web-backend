import { BaseEntity, Column, CreateDateColumn, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity({ name: 'files' })
export class FileEntity extends BaseEntity {
  constructor(partial: Partial<FileEntity>) {
    super();
    Object.assign(this, partial);
  }

  @PrimaryColumn({ type: 'uuid', generated: 'uuid' })
  id: string;

  @Index()
  @Column()
  name: string;

  @Column()
  path: string;

  @Column()
  mimetype: string;

  @Column()
  size: number;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;
}
