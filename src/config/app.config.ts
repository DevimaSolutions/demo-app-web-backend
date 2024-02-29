import { registerAs } from '@nestjs/config';

import { env } from '@/utils';
export default registerAs('app', () => ({
  port: env.number('PORT', 3001),
  name: env.string('APP_NAME'),
  version: env.string('APP_VERSION', 'v1.0.0'),
  appHostUrl: env.string('APP_HOST_URL', ''),
  frontendHostUrl: env.string('FRONTEND_HOST_URL'),
  enableSwagger: env.boolean('ENABLE_SWAGGER'),
}));
