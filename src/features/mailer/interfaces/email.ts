import { EmailTemplate } from '@/features/mailer/enums';

export interface IResetPasswordEmailParams {
  name: string;
  resetLink: string;
}

export interface IVerifyEmailParams {
  name: string;
  code: string;
}

export type EmailParams<EmailType extends EmailTemplate> =
  EmailType extends EmailTemplate.ForgotPassword
    ? IResetPasswordEmailParams
    : EmailType extends EmailTemplate.VerifyEmail
    ? IVerifyEmailParams
    : never;
