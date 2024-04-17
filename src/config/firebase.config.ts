import { registerAs } from '@nestjs/config';

import { env } from '@/utils';

export default registerAs('firebase', () => ({
  credentialsConfigs: env.string('FIREBASE_CREDENTIALS_CONFIGS'),
  databaseURL: env.string('FIREBASE_DATABASE_URL'),
}));
