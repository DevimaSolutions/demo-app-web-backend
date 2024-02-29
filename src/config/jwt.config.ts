import { registerAs } from '@nestjs/config';

import { env } from '@/utils';
export default registerAs('jwt', () => ({
  secret: env.string('JWT_SECRET', 'JWT_SECRET'),
  duration: env.string('AUTH_TOKEN_EXPIRATION', '1d'),
  refreshSecret: env.string('JWT_REFRESH_SECRET', 'REFRESH_SECRET'),
  refreshDuration: env.string('REFRESH_TOKEN_EXPIRATION', '30d'),
}));
