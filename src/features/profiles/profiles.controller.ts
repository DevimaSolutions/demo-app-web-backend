import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  Req,
  Post,
  UseInterceptors,
  UploadedFile,
  MaxFileSizeValidator,
  ParseFilePipe,
  FileTypeValidator,
  Patch,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';

import { ProfilesService } from './profiles.service';

import { Authorized } from '@/features/auth';
import { IRequestWithUser } from '@/features/auth/interfaces';
import { MessageResponse } from '@/features/common';
import { fileConstants } from '@/features/common';
import { CreateFileRequest } from '@/features/files';
import { OnboardingRequest, ProfileUpdateRequest } from '@/features/profiles/dto';
import { onboardingProfileSchema, profileUpdateSchema } from '@/features/profiles/validations';
import { JoiValidationPipe } from '@/pipes';

@ApiTags('Profile')
@Controller('profile')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Patch()
  @Authorized()
  async update(
    @Req() req: IRequestWithUser,
    @Body(new JoiValidationPipe(profileUpdateSchema)) request: ProfileUpdateRequest,
  ) {
    return this.profilesService.update(req.user, request);
  }

  @Put('/onboarding')
  @Authorized()
  async onboarding(
    @Req() req: IRequestWithUser,
    @Body(new JoiValidationPipe(onboardingProfileSchema))
    request: OnboardingRequest,
  ) {
    return await this.profilesService.onboarding(req.user.id, request);
  }

  @Get('/onboarding')
  @Authorized()
  async getOnboarding(@Req() req: IRequestWithUser) {
    return await this.profilesService.getOnboarding(req.user.id);
  }

  @Post('/upload/avatar')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateFileRequest })
  @Authorized()
  async upload(
    @Req() req: IRequestWithUser,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: fileConstants.avatarSize }),
          new FileTypeValidator({ fileType: fileConstants.imageMimeTypesRegexp }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.profilesService.upload(req.user.id, file);
  }

  @Delete()
  @Authorized()
  async remove(@Req() req: IRequestWithUser): Promise<MessageResponse> {
    return await this.profilesService.remove(req.user.id);
  }
}
