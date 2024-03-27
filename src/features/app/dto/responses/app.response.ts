import { ApiProperty } from '@nestjs/swagger';

export class AppResponse {
  constructor(name: string, version: string, isHealthy = true) {
    Object.assign(this, { name, version, isHealthy });
  }

  @ApiProperty()
  name: string;

  @ApiProperty()
  version: string;

  @ApiProperty()
  isHealthy: boolean;
}
