import { registerAs } from '@nestjs/config';
import { DatabaseType } from 'typeorm/driver/types/DatabaseType';

import { env } from '@/utils';

export default registerAs('database', () => ({
  host: env.string('DATABASE_HOST'),
  port: env.number('DATABASE_PORT', 5432),
  username: env.string('DATABASE_USERNAME'),
  password: env.string('DATABASE_PASSWORD'),
  database: env.string('DATABASE_DATABASE'),
  type: env.string<DatabaseType>('DATABASE_DIALECT', 'postgres'),
  logging: false,
}));
