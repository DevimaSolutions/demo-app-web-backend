import {
  Controller,
  Get,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
  Param,
  StreamableFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';

import { FilesService } from './services';

import { Authorized, UserRole } from '@/features/auth';
import { CreateFileRequest } from '@/features/files/dto';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post()
  @Authorized(UserRole.Admin)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateFileRequest })
  async upload(@UploadedFile(new ParseFilePipe()) file: Express.Multer.File) {
    return this.filesService.create(file);
  }

  @Get('/:name')
  @Authorized(UserRole.Admin)
  @ApiResponse({
    status: 200,
    content: {
      'application/octet-stream': {
        schema: { type: 'string', format: 'binary' },
      },
    },
  })
  async get(@Param('name') name: string) {
    const stream = await this.filesService.getFileContentStream(name);
    return new StreamableFile(stream);
  }
}
