import "reflect-metadata";
import { config as configDotenv } from "dotenv";
import { DataSource } from "typeorm";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

import databaseConfig from "./database.config";

configDotenv();
const database = databaseConfig();

const productionConfigOverrides = {
  entities: ["dist/**/*.entity.js"],
  migrations: ["dist/migrations/**/*.js"],
  migrationsRun: true,
};

// This data source is used by TypeORM cli
// eg. to run and generate migrations
export const AppDataSource = new DataSource({
  ...database,
  synchronize: false,
  logging: true,
  entities: ["src/**/*.entity.ts"],
  migrations: ["src/migrations/**/*.ts"],
  subscribers: [],
  ...(process.env.NODE_ENV === "production" ? productionConfigOverrides : {}),
} as PostgresConnectionOptions);
