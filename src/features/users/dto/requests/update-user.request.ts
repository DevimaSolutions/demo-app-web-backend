import { OmitType, PartialType, ApiProperty } from '@nestjs/swagger';

import { CreateUserRequest } from '@/features/users/dto/requests';
import { NamePartialRequest } from '@/features/users/dto/requests/name.request';

export class UpdateUserRequest extends PartialType(OmitType(CreateUserRequest, ['name'] as const)) {
  @ApiProperty({ required: false })
  name: NamePartialRequest;
}
