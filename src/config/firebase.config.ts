import { registerAs } from '@nestjs/config';

import { env } from '@/utils';

export default registerAs('firebase', () => ({
  useCredentials: env.string('FIREBASE_USE_CREDENTIALS'),
  credentialsFilePath: env.string('FIREBASE_CREDENTIALS_FILE_PATH'),
}));
