import 'reflect-metadata';
import { config as configDotenv } from 'dotenv';
import { DataSource } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

import databaseConfig from './database.config';

configDotenv();
const database = databaseConfig();

// This data source is used by TypeORM cli
// eg. to run and generate migrations
export const AppDataSource = new DataSource({
  ...database,
  synchronize: false,
  logging: true,
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/**/*.ts'],
  subscribers: [],
} as PostgresConnectionOptions);
