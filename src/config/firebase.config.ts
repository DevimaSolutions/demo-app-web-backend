import { registerAs } from '@nestjs/config';

import { env } from '@/utils';

export default registerAs('firebase', () => ({
  useGoogleCloudSecret: env.boolean('FIREBASE_USE_GOOGLE_CLOUD_SECRET'),
  credentialsFilePathOrSecretName: env.string('FIREBASE_CREDENTIALS_FILE_PATH_OR_SECRET_NAME'),
  databaseURL: env.string('FIREBASE_DATABASE_URL'),
}));
