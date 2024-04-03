import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

import { UserRole, UserStatus } from '@/features/auth';
import { LinkedinAuthRequest, LinkedinUserinfoResponse } from '@/features/auth/dto';
import { HasherService, SocialType, UserResponse, UsersRepository } from '@/features/users';
import { UserSocials } from '@/features/users/entities';
import { UserProgress } from '@/features/users/entities/user-progress.entity';

@Injectable()
export class LinkedinAuthService {
  private accessToken: string;
  constructor(
    private readonly config: ConfigService,
    private usersRepository: UsersRepository,
    private readonly hasher: HasherService,
  ) {}

  async authenticate(code: string, redirect: string) {
    this.accessToken = await this.getAccessToken({ code, redirect });

    const userInfo = await this.getUserInfo();

    const user = await this.usersRepository.findOne({
      where: { email: userInfo.email },
      relations: { socials: true },
    });

    if (!user) {
      const newUser = await this.createUser(userInfo);
      return new UserResponse(newUser);
    }

    if (user.isBlocked) {
      throw new UnauthorizedException();
    }

    if (!user.hasSocial(userInfo.sub, SocialType.Linkedin)) {
      user.socials.push(new UserSocials({ socialId: userInfo.sub, type: SocialType.Linkedin }));
      await user.save();
    }

    if (userInfo.sub && !user.hasSocial(userInfo.sub, SocialType.Linkedin)) {
      throw new ForbiddenException();
    }

    return new UserResponse(user);
  }

  async apiClient<T>(url: string, config?: AxiosRequestConfig) {
    return axios
      .get<T>(url, {
        baseURL: 'https://api.linkedin.com/v2',
        ...(config ?? {}),
        headers: { Authorization: `Bearer ${this.accessToken}` },
      })
      .then(({ data }) => data);
  }

  async getAccessToken({ code, redirect = '' }: LinkedinAuthRequest) {
    try {
      return await axios
        .post(`/accessToken`, undefined, {
          baseURL: 'https://www.linkedin.com/oauth/v2',
          params: {
            grant_type: 'authorization_code',
            client_id: this.config.get('linkedin.clientId'),
            client_secret: this.config.get('linkedin.clientSecret'),
            redirect_uri: redirect,
            code,
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        })
        .then(({ data }: AxiosResponse<{ access_token: string }>) => data.access_token);
    } catch (e) {
      throw new BadRequestException('Invalid code');
    }
  }

  async getUserInfo() {
    try {
      return await this.apiClient<LinkedinUserinfoResponse>('/userinfo');
    } catch (e) {
      throw new ForbiddenException();
    }
  }

  async createUser({ sub, email, given_name, family_name }: LinkedinUserinfoResponse) {
    if (!sub || !email) {
      throw new BadRequestException();
    }

    return this.usersRepository.save({
      email,
      name: {
        first: given_name ?? email.replace(/@.+/, ''),
        last: family_name ?? '',
      },
      nickname: this.hasher.generateRandomNicknameFromEmail(email),
      status: UserStatus.Verified,
      role: UserRole.User,
      emailVerified: new Date(),
      socials: [new UserSocials({ socialId: sub, type: SocialType.Linkedin })],
      progress: new UserProgress({}),
    });
  }
}
