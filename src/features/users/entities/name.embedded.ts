import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Column } from 'typeorm';

export class Name {
  @ApiProperty()
  @Column({ name: '_first', default: '' })
  first: string;

  @ApiProperty()
  @Column({ name: '_last', default: '' })
  last: string;

  @Expose()
  @ApiProperty()
  get full(): string {
    return `${this.first} ${this.last}`.trim();
  }
}
