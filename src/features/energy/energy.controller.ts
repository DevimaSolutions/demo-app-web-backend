import { Controller, Post, Req } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { Authorized } from '@/features/auth';
import { IRequestWithUser } from '@/features/auth/interfaces';
import { EnergyService } from '@/features/energy/services';

@ApiTags('Energy')
@Controller('energy')
export class EnergyController {
  constructor(private readonly energyService: EnergyService) {}

  @Post('decrement')
  @Authorized()
  @ApiOperation({
    summary: 'Test decrement user energy',
    deprecated: true,
  })
  decrement(@Req() req: IRequestWithUser) {
    return this.energyService.decrement(req.user.id);
  }
}
