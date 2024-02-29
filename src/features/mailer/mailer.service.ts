import { Injectable } from '@nestjs/common';

import { EmailTemplate } from './enums';
import { EmailParams } from './interfaces';

@Injectable()
export abstract class MailerService {
  abstract send(
    recipient: string | string[],
    templateId: EmailTemplate,
    params: EmailParams<EmailTemplate>,
  ): Promise<void>;

  static getTemplateTitle: Record<EmailTemplate, string> = {
    [EmailTemplate.ForgotPassword]: 'Reset password',
  };

  async sendForgotPasswordEmail(recipient: string | string[]) {
    await this.send(recipient, EmailTemplate.ForgotPassword, {
      email: '',
      resetLink: '',
    });
  }
}
