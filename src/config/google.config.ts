import { registerAs } from '@nestjs/config';

import { env } from '@/utils';

export default registerAs('google', () => ({
  projectId: env.string('GOOGLE_PROJECT_ID'),
  clientId: env.string('GOOGLE_CLIENT_ID'),
  clientSecret: env.string('GOOGLE_CLIENT_SECRET'),
  bucket: env.string('GOOGLE_BUCKET_NAME'),
  serviceAccountConfigs: env.string('GOOGLE_SERVICE_ACCOUNT_CONFIGS'),
}));
