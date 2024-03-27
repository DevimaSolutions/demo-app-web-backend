import { Injectable } from '@nestjs/common';

import { ValidationFieldsException } from '@/exceptions';
import { errorMessages, successMessages } from '@/features/common';
import { FilesService } from '@/features/files';
import { ProfileUpdateRequest } from '@/features/profiles/dto';
import { User, UserResponse, UsersRepository } from '@/features/users';

@Injectable()
export class ProfilesService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly fileService: FilesService,
  ) {}

  async update(user: User, request: ProfileUpdateRequest) {
    const data = await request.getData();
    if (
      request.nickname &&
      (await this.usersRepository.existByNickname(request.nickname, user.id))
    ) {
      throw new ValidationFieldsException({ nickname: errorMessages.userNicknameExists });
    }
    await this.usersRepository.save(this.usersRepository.merge(user, data));
    const result = await this.usersRepository.getOneWithSkills(user.id);

    return new UserResponse(result);
  }
  async remove(id: string) {
    const user = await this.usersRepository.getOne(id);

    await this.usersRepository.softRemove(user);
    return { message: successMessages.removeProfile };
  }

  async upload(userId: string, file: Express.Multer.File) {
    const user = await this.usersRepository.getOne(userId);

    if (user.profile?.profileImage) {
      await this.fileService.remove(user.profile.profileImage);
    }
    const profileImage = await this.fileService.create(file, 'profiles');

    const userResponse = await this.usersRepository.save(
      this.usersRepository.merge(user, { profile: { profileImage } }),
    );

    return new UserResponse(userResponse);
  }
}