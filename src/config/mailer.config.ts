import { registerAs } from '@nestjs/config';

import { env } from '@/utils';

export default registerAs('mailer', () => {
  return {
    from: env.string('MAILER_EMAIL_FROM', 'noreply@example.com'),
    provider: env.string<'mailhug'>('MAILER_PROVIDER', 'mailhug'),
    mailhug: {
      host: env.string('MAILHOG_HOST', 'localhost'),
      port: env.number('MAILHOG_PORT', 1025),
      secure: false,
    },
  };
});
