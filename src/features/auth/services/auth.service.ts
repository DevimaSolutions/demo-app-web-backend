import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

import { JwtTokens, SignUpRequest } from '../dto';
import { IJwtPayload } from '../interfaces';

import { ValidationFieldsException } from '@/exceptions';
import { UserStatus } from '@/features/auth';
import { errorMessages, successMessages } from '@/features/common';
import { MailerService } from '@/features/mailer';
import { PersonalTokenService } from '@/features/personal-token';
import { TokenScope } from '@/features/personal-token/enums';
import { User, UserResponse, UsersRepository } from '@/features/users';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
    private readonly config: ConfigService,
    private readonly personalTokenService: PersonalTokenService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    try {
      const user = await this.usersRepository.getByEmail(email);

      if (!user.password) {
        return null;
      }

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
      return await this.usersRepository.getOne(payload.sub);
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

  async signUp({ email, password }: SignUpRequest) {
    const user = await this.usersRepository.findOneBy({ email });

    if (user) {
      throw new ValidationFieldsException({ email: errorMessages.userExists });
    }

    const entity = this.usersRepository.create({ email });
    entity.password = await bcrypt.hash(password, bcrypt.genSaltSync());

    await this.usersRepository.save(entity);

    await this.sendVerifyEmail(entity);

    return this.createJwtTokenPair(entity);
  }

  async sendVerifyEmail(user: User) {
    if (!user.emailVerified) {
      const { canSend, token } = await this.personalTokenService.createToken(user, [
        TokenScope.VerifyEmail,
      ]);

      if (canSend) {
        await this.mailerService.verifyMail(user.email, token, user?.name.full ?? user.email);
      }

      return { message: successMessages.emailSent };
    }

    return { message: successMessages.emailIsVerified };
  }

  async verifyEmail(token: string) {
    try {
      const { sub } = await this.jwtService.verifyAsync(token);
      const user = await this.usersRepository.getOneBy({ id: sub });
      await this.usersRepository.update(user.id, { emailVerified: new Date() });
      await this.personalTokenService.revokeUserToken(user.id);

      return { message: successMessages.emailIsVerified };
    } catch (e) {
      const message: string | undefined =
        e instanceof TokenExpiredError ||
        e instanceof JsonWebTokenError ||
        e instanceof NotFoundException
          ? errorMessages.unexpectedToken
          : undefined;

      throw new BadRequestException(message);
    }
  }

  async refreshAccessToken(refreshToken: string) {
    try {
      const result: Pick<IJwtPayload, 'sub'> = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.config.get<string>('jwt.refreshSecret'),
      });
      const user = await this.usersRepository.getOne(result.sub);
      return this.createJwtTokenPair(user);
    } catch {
      throw new BadRequestException();
    }
  }

  async sendForgotPasswordEmail(email: string) {
    try {
      const user = await this.usersRepository.findOneBy({ email, status: UserStatus.Active });
      if (user) {
        const { canSend, token } = await this.personalTokenService.createToken(user, [
          TokenScope.ForgotPassword,
        ]);

        if (canSend) {
          await this.mailerService.sendForgotPasswordEmail(email, token, user.name.full);
        }
      }
      return { message: successMessages.emailSent };
    } catch (e) {
      throw new BadRequestException(errorMessages.mailingServiceUnavailable);
    }
  }

  async resetPassword(token: string, password: string) {
    try {
      const { sub } = await this.jwtService.verifyAsync(token);
      const hash = await bcrypt.hash(password, bcrypt.genSaltSync());
      await this.usersRepository.update(sub, { password: hash });
      await this.personalTokenService.revokeUserToken(sub);
      return { message: successMessages.passwordChanged };
    } catch (e) {
      const message: string | undefined =
        e instanceof TokenExpiredError || e instanceof JsonWebTokenError
          ? errorMessages.unexpectedToken
          : undefined;

      throw new BadRequestException(message);
    }
  }
}
