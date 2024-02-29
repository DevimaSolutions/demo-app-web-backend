import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { MailerService } from './mailer.service';
import { MailhogService } from './mailhog.service';

const services = {
  mailhug: MailhogService,
};

@Module({
  providers: [
    {
      provide: MailerService,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const provider = config.get<'mailhug'>('mailer.provider', 'mailhug');
        const service = services?.[provider];
        return service ? new service(config) : null;
      },
    },
  ],
  exports: [MailerService],
})
export class MailerModule {}
