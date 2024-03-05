import { EmailTemplate } from '@/features/mailer/enums';

export interface IResetPasswordEmailParams {
  name: string;
  resetLink: string;
}

export type EmailParams<EmailType extends EmailTemplate> =
  EmailType extends EmailTemplate.ForgotPassword ? IResetPasswordEmailParams : never;
