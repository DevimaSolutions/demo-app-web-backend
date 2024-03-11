import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { stringify } from 'qs';

import { EmailTemplate } from './enums';
import { EmailParams } from './interfaces';

@Injectable()
export abstract class MailerService {
  protected constructor(protected readonly config: ConfigService) {}

  abstract send(
    recipient: string | string[],
    templateId: EmailTemplate,
    params: EmailParams<EmailTemplate>,
  ): Promise<void>;

  static getTemplateTitle: Record<EmailTemplate, string> = {
    [EmailTemplate.ForgotPassword]: 'Reset password',
    [EmailTemplate.VerifyEmail]: 'Email Confirmation',
  };

  async sendForgotPasswordEmail(recipient: string | string[], token: string, name: string) {
    await this.send(recipient, EmailTemplate.ForgotPassword, {
      name,
      resetLink: `${this.config.get('app.frontendHostUrl')}/reset-password?${stringify({ token })}`,
    });
  }

  async verifyMail(recipient: string | string[], token: string, name: string) {
    await this.send(recipient, EmailTemplate.VerifyEmail, {
      name,
      link: `${this.config.get('app.frontendHostUrl')}/email-verify?${stringify({ token })}`,
    });
  }
}
