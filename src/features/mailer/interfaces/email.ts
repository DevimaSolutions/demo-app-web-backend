import { EmailTemplate } from '@/features/mailer/enums';

export interface IResetPasswordEmailParams {
  name: string;
  resetLink: string;
}

export interface IVerifyMailParams {
  name: string;
  link: string;
}

export type EmailParams<EmailType extends EmailTemplate> =
  EmailType extends EmailTemplate.ForgotPassword
    ? IResetPasswordEmailParams
    : EmailType extends EmailTemplate.VerifyMail
    ? IVerifyMailParams
    : never;
