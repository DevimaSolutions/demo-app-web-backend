import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AppResponse } from '@/features/app/dto';

@Injectable()
export class AppService {
  constructor(private readonly config: ConfigService) {}

  getHealthCheck() {
    const name = this.config.get<string>('app.name', '');
    const version = this.config.get<string>('app.version', '');
    return new AppResponse(name, version);
  }
}
