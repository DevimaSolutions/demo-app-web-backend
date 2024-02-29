import { PartialType } from '@nestjs/swagger';

import { CreateUserRequest } from '@/features/users/dto/request';

export class UpdateUserRequest extends PartialType(CreateUserRequest) {}
