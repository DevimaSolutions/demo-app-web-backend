import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CustomerioService } from './customerio.service';
import { MailerService } from './mailer.service';
import { MailhogService } from './mailhog.service';

const services = {
  mailhog: MailhogService,
  customerio: CustomerioService,
};

@Module({
  providers: [
    {
      provide: MailerService,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const provider = config.get<'mailhog' | 'customerio'>('mailer.provider', 'mailhog');
        const service = services?.[provider];
        return service ? new service(config) : null;
      },
    },
  ],
  exports: [MailerService],
})
export class MailerModule {}
