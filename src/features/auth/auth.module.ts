import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from './auth.controller';
import { AuthService, GoogleAuthService, LinkedinAuthService } from './services';
import { JwtStrategy, LocalStrategy, GoogleStrategy, LinkedinStrategy } from './strategies';

import { FirebaseModule } from '@/features/firebase';
import { MailerModule } from '@/features/mailer';
import { UsersService, HasherService, UsersRepository } from '@/features/users';

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
    FirebaseModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    GoogleAuthService,
    LinkedinAuthService,
    HasherService,
    UsersService,
    UsersRepository,
    JwtStrategy,
    LocalStrategy,
    GoogleStrategy,
    LinkedinStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
