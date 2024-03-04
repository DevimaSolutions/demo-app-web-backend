import { OmitType, PartialType, ApiProperty } from '@nestjs/swagger';

import { CreateUserRequest } from '@/features/users/dto/request';
import { NamePartialRequest } from '@/features/users/dto/request/name.request';

export class UpdateUserRequest extends PartialType(OmitType(CreateUserRequest, ['name'] as const)) {
  @ApiProperty({ required: false })
  name: NamePartialRequest;
}
