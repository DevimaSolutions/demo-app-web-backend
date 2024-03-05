import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Auth, google } from 'googleapis';

import { UserRole, UserStatus } from '@/features/auth';
import { UserResponse, UsersRepository } from '@/features/users';

@Injectable()
export class GoogleAuthService {
  private readonly oauthClient: Auth.OAuth2Client;

  constructor(private readonly config: ConfigService, private usersRepository: UsersRepository) {
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

    if (user.status !== UserStatus.Active) {
      throw new UnauthorizedException();
    }

    if (!user.googleId) {
      user.googleId = sub;
      await user.save();
    }

    if (sub && user.googleId !== sub) {
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
        first: given_name ?? email.split('@')[0],
        last: family_name ?? '',
      },
      status: UserStatus.Active,
      role: UserRole.User,
      emailVerified: new Date(),
      googleId: id,
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
