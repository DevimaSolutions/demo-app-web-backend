import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppResponse } from './dto';

import { loadConfig } from '@/config';

describe('AppController', () => {
  let appController: AppController;
  let config: ConfigService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: loadConfig,
          cache: true,
          isGlobal: true,
        }),
      ],
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
    config = app.get<ConfigService>(ConfigService);
  });

  describe('root', () => {
    it('should return "Hello"', () => {
      expect(appController.getHealthCheck()).toEqual(
        new AppResponse(config.get<string>('app.name', ''), config.get<string>('app.version', '')),
      );
    });
  });
});
