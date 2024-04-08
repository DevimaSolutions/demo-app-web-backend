import { default as appConfig } from './app.config';
import { default as databaseConfig } from './database.config';
import { default as googleConfig } from './google.config';
import { default as jwtConfig } from './jwt.config';
import { default as linkedinConfig } from './linkedin.config';
import { default as mailerConfig } from './mailer.config';
import { default as stripeConfig } from './stripe.config';

export const loadConfig = [
  appConfig,
  databaseConfig,
  jwtConfig,
  mailerConfig,
  googleConfig,
  linkedinConfig,
  stripeConfig,
];
