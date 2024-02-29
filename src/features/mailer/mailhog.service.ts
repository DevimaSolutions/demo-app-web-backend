import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transporter, createTransport } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

import { EmailTemplate } from './enums';
import { EmailParams } from './interfaces';
import { MailerService } from './mailer.service';

@Injectable()
export class MailhogService extends MailerService {
  private transporter: Transporter<SMTPTransport.SentMessageInfo>;

  constructor(private readonly config: ConfigService) {
    super();

    this.transporter = createTransport(this.config.get(`mailer.mailhug`));
  }

  async send(recipient: string, templateId: EmailTemplate, params: EmailParams<EmailTemplate>) {
    await this.transporter.sendMail({
      from: `${this.config.get<string>(
        'mailer.from',
        'noreply@example.com',
      )} <no-reply@example.org>`,
      to: recipient,
      subject: `${MailhogService.getTemplateTitle[templateId]} - ${this.config.get<string>(
        'app.name',
      )}`,
      text: JSON.stringify(params, null, 2),
    });
  }
}
