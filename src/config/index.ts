import { default as appConfig } from './app.config';
import { default as databaseConfig } from './database.config';
import { default as jwtConfig } from './jwt.config';
import { default as mailerConfig } from './mailer.config';

export const loadConfig = [appConfig, databaseConfig, jwtConfig, mailerConfig];
