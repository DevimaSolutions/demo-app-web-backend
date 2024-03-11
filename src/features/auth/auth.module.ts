import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from './auth.controller';
import { AuthService, GoogleAuthService, LinkedinAuthService } from './services';
import { JwtStrategy, LocalStrategy, GoogleStrategy, LinkedinStrategy } from './strategies';

import { MailerModule } from '@/features/mailer';
import { PersonalTokenRepository, PersonalTokenService } from '@/features/personal-token';
import { UsersService, UsersRepository } from '@/features/users';

@Module({
  imports: [
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
        signOptions: { expiresIn: configService.get<string>('jwt.duration') },
      }),
      inject: [ConfigService],
    }),
    MailerModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    GoogleAuthService,
    LinkedinAuthService,
    PersonalTokenService,
    UsersService,
    UsersRepository,
    JwtStrategy,
    LocalStrategy,
    GoogleStrategy,
    LinkedinStrategy,
    PersonalTokenRepository,
  ],
  exports: [AuthService],
})
export class AuthModule {}
