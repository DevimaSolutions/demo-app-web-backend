import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

import { loadConfig } from './config';

import { AppService, AppController } from '@/features/app';
import { AuthModule } from '@/features/auth';
import { MailerModule } from '@/features/mailer';
import { UsersModule } from '@/features/users';

// TODO: Add global filter to return success object
// on empty response with status code 200
@Module({
  imports: [
    ConfigModule.forRoot({
      load: loadConfig,
      cache: true,
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        autoLoadEntities: true,
        synchronize: false,
        ...config.get('database'),
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    MailerModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}
