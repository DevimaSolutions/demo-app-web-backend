import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { AppService } from './app.service';

import { AppResponse } from '@/features/app/dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ description: 'Check if the app is healthy' })
  @ApiTags('Health')
  getHealthCheck(): AppResponse {
    return this.appService.getHealthCheck();
  }
}
