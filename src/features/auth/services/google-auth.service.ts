import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Auth, google } from 'googleapis';

import { UserRole, UserStatus } from '@/features/auth';
import { HasherService, UserResponse, UsersRepository } from '@/features/users';
import { UserSocials } from '@/features/users/entities';

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

    const user = await this.usersRepository.findOneBy({ email });

    if (!user) {
      const newUser = await this.createUser(token);
      return new UserResponse(newUser);
    }

    if (user.status === UserStatus.Blocked) {
      throw new UnauthorizedException();
    }

    if (!user.socials?.googleId) {
      user.socials = new UserSocials({ googleId: sub });
      await user.save();
    }

    if (sub && user.socials.googleId !== sub) {
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
      name: {
        first: given_name ?? email.replace(/@.+/, ''),
        last: family_name ?? '',
      },
      nickname: this.hasher.generateRandomNicknameFromEmail(email),
      status: UserStatus.Active,
      role: UserRole.User,
      emailVerified: new Date(),
      socials: new UserSocials({ googleId: id }),
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
