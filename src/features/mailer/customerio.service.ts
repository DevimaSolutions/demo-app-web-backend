import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APIClient, SendEmailRequest } from 'customerio-node';

import { EmailTemplate } from './enums';
import { EmailParams } from './interfaces';
import { MailerService } from './mailer.service';

@Injectable()
export class CustomerioService extends MailerService {
  private apiClient: APIClient;
  private senderEmail: string;

  constructor(protected readonly config: ConfigService) {
    super(config);
    this.apiClient = new APIClient(this.config.get('mailer.customerio.appApiKey') || '');
    this.senderEmail = this.config.get<string>('mailer.from') || 'noreply@example.com';
  }

  async send(recipient: string, templateId: EmailTemplate, params: EmailParams<EmailTemplate>) {
    const request = new SendEmailRequest({
      to: recipient,
      from: this.senderEmail,
      transactional_message_id: templateId,
      identifiers: {
        email: recipient,
      },
      message_data: params,
    });

    await this.apiClient.sendEmail(request);
  }
}
