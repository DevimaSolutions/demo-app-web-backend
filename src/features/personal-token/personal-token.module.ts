import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PersonalTokenRepository } from './personal-token.repository';
import { PersonalTokenService } from './personal-token.service';

import { PersonalToken } from '@/features/personal-token/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([PersonalToken]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
        signOptions: { expiresIn: configService.get<string>('jwt.duration') },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [PersonalTokenService, PersonalTokenRepository],
})
export class PersonalTokenModule {}
