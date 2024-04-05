import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommandModule } from 'nestjs-command';

import { loadConfig } from './config';

import { AppService, AppController } from '@/features/app';
import { AuthModule } from '@/features/auth';
import { FilesModule } from '@/features/files';
import { FirebaseModule } from '@/features/firebase';
import { MailerModule } from '@/features/mailer';
import { PaymentsModule } from '@/features/payments';
import { ProfilesModule } from '@/features/profiles';
import { SeederModule, SeederCommand } from '@/features/seeder';
import { seederConfig } from '@/features/seeder/seeders';
import { SoftSkillsModule } from '@/features/soft-skills';
import { SubscriptionsModule } from '@/features/subscriptions';
import { UserCommand, UsersModule } from '@/features/users';
import { WebhooksModule } from '@/features/webhooks';

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
    EventEmitterModule.forRoot(),
    AuthModule,
    UsersModule,
    ProfilesModule,
    MailerModule,
    CommandModule,
    SeederModule.forRoot(seederConfig),
    FilesModule,
    SoftSkillsModule,
    PaymentsModule,
    SubscriptionsModule,
    WebhooksModule,
    FirebaseModule,
  ],
  controllers: [AppController],
  providers: [
    UserCommand,
    SeederCommand,
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}
