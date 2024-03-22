import {
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';

import { UserRole, UserStatus } from '@/features/auth';
import { LinkedinAuthRequest, LinkedinUserinfoResponse } from '@/features/auth/dto';
import { HasherService, UserResponse, UsersRepository } from '@/features/users';
import { UserSocials } from '@/features/users/entities';

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

    const user = await this.usersRepository.findOneBy({ email: userInfo.email });

    if (!user) {
      const newUser = await this.createUser(userInfo);
      return new UserResponse(newUser);
    }

    if (user.status === UserStatus.Blocked) {
      throw new UnauthorizedException();
    }

    if (!user.socials?.linkedinId) {
      user.socials = new UserSocials({ linkedinId: userInfo.sub });
      await user.save();
    }

    if (userInfo.sub && user.socials.linkedinId !== userInfo.sub) {
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
      status: UserStatus.Active,
      role: UserRole.User,
      emailVerified: new Date(),
      socials: new UserSocials({ linkedinId: sub }),
    });
  }
}
