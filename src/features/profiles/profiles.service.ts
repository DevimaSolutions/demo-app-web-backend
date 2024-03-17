import { BadRequestException, Injectable } from '@nestjs/common';

import { errorMessages } from '@/features/common';
import { OnboardingRequest, OnboardingResponse } from '@/features/profiles/dto';
import { UsersRepository } from '@/features/users';

@Injectable()
export class ProfilesService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async onboarding(userId: string, request: OnboardingRequest) {
    const user = await this.usersRepository.getOne(userId);

    if (user?.profile?.isOnboardingCompleted) {
      throw new BadRequestException(errorMessages.onboardingAlreadyCompleted);
    }

    const data = this.parseOnboardingDataFromRequest(request);
    let result = await this.usersRepository.save(this.usersRepository.merge(user, data));

    const response = new OnboardingResponse(result);

    if (response.complete) {
      result = await this.usersRepository.save(
        this.usersRepository.merge(result, { profile: { isOnboardingCompleted: true } }),
      );
      return new OnboardingResponse(result);
    }

    return response;
  }

  parseOnboardingDataFromRequest(request: OnboardingRequest) {
    const { name = null, ...rest } = request?.firstStep ?? {};
    const user = name ? { name: { first: name } } : {};
    return {
      ...user,
      profile: {
        ...rest,
        ...(request?.secondStep || {}),
        ...(request?.thirdStep || {}),
      },
    };
  }
  async getOnboarding(userId: string) {
    const user = await this.usersRepository.getOne(userId);
    return new OnboardingResponse(user);
  }
}
