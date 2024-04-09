import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Auth, google } from 'googleapis';

import { UserRole, UserStatus } from '@/features/auth';
import { HasherService, SocialType, UserResponse, UsersRepository } from '@/features/users';
import { UserSocials } from '@/features/users/entities';
import { UserProgress } from '@/features/users/entities/user-progress.entity';

@Injectable()
export class GoogleAuthService {
  private readonly oauthClient: Auth.OAuth2Client;

  constructor(
    private readonly config: ConfigService,
    private usersRepository: UsersRepository,
    private readonly hasher: HasherService,
  ) {
    const clientID = this.config.get('google.clientId');
    const clientSecret = this.config.get('google.clientSecret');
    this.oauthClient = new google.auth.OAuth2(clientID, clientSecret);
  }

  async authenticate(token: string) {
    const { email, sub } = await this.getTokenInfo(token);

    const user = await this.usersRepository.findOne({
      where: { email },
      relations: { socials: true },
    });

    if (!user) {
      const newUser = await this.createUser(token);
      return new UserResponse(newUser);
    }

    if (user.isBlocked) {
      throw new UnauthorizedException();
    }

    if (!user.hasSocial(sub, SocialType.Google)) {
      user.socials.push(new UserSocials({ socialId: sub, type: SocialType.Google }));
      await user.save();
    }

    if (sub && !user.hasSocial(sub, SocialType.Google)) {
      throw new ForbiddenException();
    }

    return new UserResponse(user);
  }

  async getTokenInfo(token: string) {
    try {
      return await this.oauthClient.getTokenInfo(token);
    } catch (e) {
      throw new BadRequestException('Invalid token');
    }
  }

  async createUser(token: string) {
    const { id, email, given_name, family_name } = await this.getUserInfo(token);

    if (!id || !email) {
      throw new UnauthorizedException();
    }

    return this.usersRepository.save({
      email,
      name:
        given_name || family_name
          ? `${given_name} ${family_name}`.trim()
          : email.replace(/@.+/, ''),
      username: this.hasher.generateRandomUsernameFromEmail(email),
      status: UserStatus.Verified,
      role: UserRole.User,
      emailVerified: new Date(),
      socials: [new UserSocials({ socialId: id, type: SocialType.Google })],
      progress: new UserProgress({}),
    });
  }

  async getUserInfo(token: string) {
    try {
      const userInfoClient = google.oauth2('v2').userinfo;

      this.oauthClient.setCredentials({
        access_token: token,
      });

      const userInfoResponse = await userInfoClient.get({
        auth: this.oauthClient,
      });

      return userInfoResponse.data;
    } catch (error) {
      throw new ForbiddenException();
    }
  }
}
