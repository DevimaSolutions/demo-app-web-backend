import { registerAs } from '@nestjs/config';

import { env } from '@/utils';

export default registerAs('firebase', () => ({
  credentialsFilePath: env.string('FIREBASE_CREDENTIALS_FILE_PATH'),
  databaseURL: env.string('FIREBASE_DATABASE_URL'),
}));
