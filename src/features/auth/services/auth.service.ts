import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { JwtTokens } from '../dto';
import { IJwtPayload } from '../interfaces';

import { User, UserResponse, UsersService } from '@/features/users';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    try {
      const user = await this.usersService.findByEmail(email);

      const doPasswordsMatch = await bcrypt.compare(password, user.password);
      if (doPasswordsMatch) {
        return user;
      }
      return null;
    } catch (e) {
      if (e instanceof NotFoundException) {
        // User was not found
        return null;
      }
      throw e;
    }
  }

  async validateUserPayload(payload: IJwtPayload): Promise<User | UserResponse | null> {
    try {
      return await this.usersService.findOne(payload.sub);
    } catch (e) {
      if (e instanceof NotFoundException) {
        // User was not found
        return null;
      }
      throw e;
    }
  }

  async createJwtTokenPair(user: User | UserResponse): Promise<JwtTokens> {
    const payload: IJwtPayload = { email: user.email, sub: user.id, role: user.role };
    return {
      accessToken: await this.jwtService.signAsync(payload),
      refreshToken: await this.jwtService.signAsync(Object.assign({ sub: user.id }), {
        secret: this.config.get('jwt.refreshSecret'),
        expiresIn: this.config.get<string>('jwt.refreshDuration'),
      }),
    };
  }

  async signIn(user: User) {
    return this.createJwtTokenPair(user);
  }

  async refreshAccessToken(refreshToken: string) {
    try {
      const result: Pick<IJwtPayload, 'sub'> = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.config.get<string>('jwt.refreshSecret'),
      });
      const user = await this.usersService.findOne(result.sub);
      return this.createJwtTokenPair(user);
    } catch {
      throw new BadRequestException();
    }
  }
}
