import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { MailerService } from './mailer.service';
import { MailhogService } from './mailhog.service';

const services = {
  mailhog: MailhogService,
};

@Module({
  providers: [
    {
      provide: MailerService,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const provider = config.get<'mailhog'>('mailer.provider', 'mailhog');
        const service = services?.[provider];
        return service ? new service(config) : null;
      },
    },
  ],
  exports: [MailerService],
})
export class MailerModule {}
