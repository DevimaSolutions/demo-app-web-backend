import { registerAs } from '@nestjs/config';

import { env } from '@/utils';

export default registerAs('mailer', () => {
  return {
    from: env.string('MAILER_EMAIL_FROM', 'noreply@example.com'),
    provider: env.string<'mailhog'>('MAILER_PROVIDER', 'mailhog'),
    mailhog: {
      host: env.string('MAILHOG_HOST', 'localhost'),
      port: env.number('MAILHOG_PORT', 1025),
      secure: false,
    },
  };
});
