import { ApiProperty } from '@nestjs/swagger';

import { FileEntity } from '@/features/files/entities';

export class FileResponse {
  constructor(file: FileEntity) {
    Object.assign(this, file);
  }
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  path: string;

  @ApiProperty()
  mimetype: string;

  @ApiProperty()
  size: number;

  @ApiProperty()
  createdAt: Date;
}
