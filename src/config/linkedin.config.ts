import { registerAs } from '@nestjs/config';

import { env } from '@/utils';
export default registerAs('linkedin', () => ({
  clientId: env.string('LINKEDIN_CLIENT_ID'),
  clientSecret: env.string('LINKEDIN_CLIENT_SECRET'),
}));
