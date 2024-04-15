import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { differenceInSeconds } from 'date-fns';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import ms from 'ms';

import { ValidationFieldsException } from '@/exceptions';
import { JwtTokensResponse, SignUpRequest } from '@/features/auth/dto';
import { IJwtPayload } from '@/features/auth/interfaces';
import { errorMessages, successMessages } from '@/features/common';
import { Energy } from '@/features/energy/entities/energy.entity';
import { MailerService } from '@/features/mailer';
import {
  HasherService,
  User,
  UserResponse,
  UsersRepository,
  VerificationTokenType,
} from '@/features/users';
import { UserProgress } from '@/features/users/entities/user-progress.entity';
import { UsersVerificationToken } from '@/features/users/entities/users-verification-token.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly hasher: HasherService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
    private readonly config: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    try {
      const user = await this.usersRepository.getByEmail(email);

      if (!user.password) {
        return null;
      }

      const doPasswordsMatch = await this.hasher.compare(password, user.password);
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

  async validateUserPayload(payload: IJwtPayload): Promise<User | null> {
    try {
      return await this.usersRepository.getOneWithActiveSubscription(payload.sub);
    } catch (e) {
      if (e instanceof NotFoundException) {
        // User was not found
        return null;
      }
      throw e;
    }
  }

  async createJwtTokenPair(user: User | UserResponse): Promise<JwtTokensResponse> {
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

    const entity = this.usersRepository.create({
      email,
      username: this.hasher.generateRandomUsernameFromEmail(email),
      progress: new UserProgress({}),
      energy: new Energy({}),
    });
    entity.password = await this.hasher.hash(password);

    await this.usersRepository.save(entity);

    await this.sendVerifyEmail(entity.id);

    return this.createJwtTokenPair(entity);
  }

  async sendVerifyEmail(userId: string) {
    const user = await this.usersRepository.getOneWithRelations({ id: userId }, { tokens: true });

    if (user.isVerified || user.isActive) {
      return { message: successMessages.emailIsVerified };
    }
    const token = user.tokens.find((token) => token.isVerifyEmail);
    const allowSubmit = token ? differenceInSeconds(new Date(), token.submittedAt) >= 60 : true;

    if (user.isPending && allowSubmit) {
      const verifyToken = UsersVerificationToken.makeVerifyEmail(
        token?.id,
        this.hasher.generateValidationCode(),
        ms(this.config.get<string>('jwt.emailDuration', '1h')),
      );
      this.usersRepository.merge(user, { tokens: [verifyToken] });

      await user.save();

      await this.mailerService.verifyMail(
        user.email,
        verifyToken.token as string,
        user?.name ?? user.email,
      );
    }
    return { message: successMessages.emailSent };
  }

  async verifyEmail(id: string, code: string) {
    try {
      const user = await this.usersRepository.getUserByEmailVerificationCode(id, code);

      await this.usersRepository.verifyEmail(user);
      return { message: successMessages.emailIsVerified };
    } catch (e) {
      const message: string | undefined =
        e instanceof TokenExpiredError ||
        e instanceof JsonWebTokenError ||
        e instanceof NotFoundException
          ? errorMessages.unexpectedCode
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
      const user = await this.usersRepository.findActiveUserByEmail(email, { tokens: true });
      if (user) {
        const passwordResetToken = user.tokens.find((token) => token.isPasswordReset);
        const allowSubmit = passwordResetToken
          ? differenceInSeconds(new Date(), passwordResetToken.submittedAt) >= 60
          : true;

        if (allowSubmit) {
          const token = await this.jwtService.signAsync(Object.assign({ sub: user.id }), {
            expiresIn: this.config.get('jwt.emailDuration'),
          });
          const verifyToken = UsersVerificationToken.makePasswordReset(passwordResetToken?.id);
          this.usersRepository.merge(user, { tokens: [verifyToken] });
          await user.save();

          await this.mailerService.sendForgotPasswordEmail(email, token, user.name);
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
      const hash = await this.hasher.hash(password);
      const user = await this.usersRepository.getOneWithRelations(
        { id: sub, tokens: { type: VerificationTokenType.PasswordReset } },
        { tokens: true },
      );
      await this.usersRepository.resetPassword(user, hash);
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
