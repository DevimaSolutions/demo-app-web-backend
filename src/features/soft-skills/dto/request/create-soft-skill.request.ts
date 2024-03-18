import { ApiProperty } from '@nestjs/swagger';

export class CreateSoftSkillRequest {
  @ApiProperty()
  name: string;
}
