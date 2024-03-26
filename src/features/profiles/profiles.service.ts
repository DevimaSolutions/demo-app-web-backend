import { BadRequestException, Injectable } from '@nestjs/common';

import { ValidationFieldsException } from '@/exceptions';
import { errorMessages, successMessages } from '@/features/common';
import { FilesService } from '@/features/files';
import {
  OnboardingRequest,
  OnboardingResponse,
  ProfileFriendsPaginateQuery,
  ProfileUpdateRequest,
} from '@/features/profiles/dto';
import { SoftSkillsRepository } from '@/features/soft-skills';
import { User, UserResponse, UsersRepository } from '@/features/users';
import { UsersToFriends } from '@/features/users/entities/users-to-friend.entity';
import { UsersToFriendsRepository } from '@/features/users/repositoies';

@Injectable()
export class ProfilesService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly softSkillsRepository: SoftSkillsRepository,
    private readonly usersToFriendsRepository: UsersToFriendsRepository,
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

  async getFriends(user: User, query: ProfileFriendsPaginateQuery) {
    return await this.usersRepository.findAllFriendsPaginate(user.id, query);
  }
  async addFriend(userId: string, friendId: string) {
    const friend = await this.usersRepository.findActiveUser(friendId);

    if (friend) {
      await new UsersToFriends({ userId, friendId }).save();
      await new UsersToFriends({ userId: friendId, friendId: userId }).save();
    }

    return { message: successMessages.success };
  }

  async removeFriend(userId: string, friendId: string) {
    const promises = [
      await this.usersToFriendsRepository.findOneBy({ userId, friendId }),
      await this.usersToFriendsRepository.findOneBy({ userId: friendId, friendId: userId }),
    ];

    const friends = await Promise.all(promises);

    for (const friend of friends) {
      if (friend) {
        await friend.remove();
      }
    }

    return { message: successMessages.success };
  }

  async onboarding(userId: string, request: OnboardingRequest) {
    const user = await this.usersRepository.getOne(userId);

    if (user?.profile?.isOnboardingCompleted) {
      throw new BadRequestException(errorMessages.onboardingAlreadyCompleted);
    }

    const data = await this.parseOnboardingDataFromRequest(user.id, request);

    const save = await this.usersRepository.save(this.usersRepository.merge(user, data));

    const result = await this.usersRepository.getOneWithRelations(userId, {
      usersToSkills: { softSkill: true },
    });

    const response = new OnboardingResponse(result);

    if (response.complete) {
      await this.usersRepository.save(
        this.usersRepository.merge(save, {
          profile: { isOnboardingCompleted: true },
        }),
      );
    }

    return response;
  }

  private async parseOnboardingDataFromRequest(userId: string, request: OnboardingRequest) {
    const { name = null, ...rest } = request?.firstStep ?? {};

    const usersToSkills = await this.softSkillsRepository.findSoftSkillsByIds(
      request?.fourthStep?.softSkills ?? [],
    );
    const user = name ? { name: { first: name }, usersToSkills } : { usersToSkills };

    return {
      ...user,
      profile: {
        ...rest,
        ...(request?.secondStep || {}),
        ...(request?.thirdStep || {}),
        user: {
          id: userId,
        },
      },
    };
  }

  async getOnboarding(userId: string) {
    const user = await this.usersRepository.getOneWithSkills(userId);
    return new OnboardingResponse(user);
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
