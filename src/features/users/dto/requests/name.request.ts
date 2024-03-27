import { OmitType, PartialType } from '@nestjs/swagger';

import { Name } from '@/features/users/entities/name.embedded';

export class NameRequest extends OmitType(Name, ['full'] as const) {}
export class NamePartialRequest extends PartialType(OmitType(Name, ['full'] as const)) {}
