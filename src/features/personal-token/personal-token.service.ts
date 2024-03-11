import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { addMilliseconds, differenceInSeconds } from 'date-fns';
import ms from 'ms';

import { PersonalToken } from '@/features/personal-token/entities';
import { TokenScope } from '@/features/personal-token/enums';
import { PersonalTokenRepository } from '@/features/personal-token/personal-token.repository';
import { User } from '@/features/users';

@Injectable()
export class PersonalTokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly tokenRepository: PersonalTokenRepository,
  ) {}

  async createToken(user: User, scopes: TokenScope[] = []) {
    let token = await this.tokenRepository.findValidTokenForUser(user.id, scopes);
    let isNew = false;
    if (!token) {
      await this.tokenRepository.revokeAllUserToken(user.id, scopes);

      const emailDuration = this.config.get<string>('jwt.emailDuration', '1d');

      token = await this.tokenRepository.save({
        user: { id: user.id },
        revoked: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        expiresAt: addMilliseconds(new Date(), ms(emailDuration)),
        scopes,
      });
      isNew = true;
    }

    const lastUpdated = differenceInSeconds(new Date(), token.updatedAt) >= 60;

    if (!isNew && lastUpdated) {
      await this.tokenRepository.update(token.id, { updatedAt: new Date() });
    }

    return { canSend: isNew || lastUpdated, token: await this.signToken(token) };
  }

  async revokeUserToken(id: string) {
    await this.tokenRepository.revokeUserToken(id);
  }

  async signToken(token: PersonalToken) {
    const seconds = differenceInSeconds(token.expiresAt, token.createdAt);
    return this.jwtService.signAsync(
      Object.assign({
        sub: token.user.id,
        iat: Math.floor(token.createdAt.getTime() / 1000),
      }),
      { expiresIn: seconds },
    );
  }
}
