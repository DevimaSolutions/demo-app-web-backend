import { registerAs } from '@nestjs/config';

import { env } from '@/utils';

export default registerAs('google', () => ({
  clientId: env.string('GOOGLE_CLIENT_ID'),
  clientSecret: env.string('GOOGLE_CLIENT_SECRET'),
  bucket: env.string('GOOGLE_BUCKET_NAME'),
  keyFilename: env.string('GOOGLE_KEY_FILENAME'),
}));
