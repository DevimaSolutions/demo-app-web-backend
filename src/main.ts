import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import configureSwagger from './config/swagger.config';
import { initializeTransactionalContext } from './features/common/transaction.util';

async function bootstrap() {
  initializeTransactionalContext();

  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);

  app.enableCors({ origin: config.get<string>('app.frontendHostUrl') });

  if (config.get<boolean>('app.enableSwagger')) {
    configureSwagger(app, config);
  }

  await app.listen(config.get<number>('app.port', 3001));
}
bootstrap();
