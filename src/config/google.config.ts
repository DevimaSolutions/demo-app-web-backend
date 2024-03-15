import { registerAs } from '@nestjs/config';

import { env } from '@/utils';

export default registerAs('google', () => ({
  clientId: env.string('GOOGLE_CLIENT_ID'),
  clientSecret: env.string('GOOGLE_CLIENT_SECRET'),
  bucket: env.string('GOOGLE_BUCKET_NAME'),
  projectId: env.string('GOOGLE_PROJECT_ID'),
  clientEmail: env.string('GOOGLE_CLIENT_EMAIL'),
  privateKey: env.string('GOOGLE_PRIVATE_KEY'),
}));
