import { ApiProperty } from '@nestjs/swagger';

export class CreateFileRequest {
  @ApiProperty({ type: 'string', format: 'binary', description: 'File to upload' })
  file: Express.Multer.File;
}
