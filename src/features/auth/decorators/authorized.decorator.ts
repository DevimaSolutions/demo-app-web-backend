import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import {
  Roles,
  Status,
  UserRole,
  JwtAuthGuard,
  RolesGuard,
  StatusGuard,
  UserStatus,
} from '@/features/auth';

type AuthorizedType = UserRole[] | UserStatus[] | [UserRole[], UserStatus[]];

function Authorized(): ReturnType<typeof applyDecorators>;
function Authorized(...roles: UserRole[]): ReturnType<typeof applyDecorators>;
function Authorized(...statuses: UserStatus[]): ReturnType<typeof applyDecorators>;
function Authorized(roles: UserRole[], statuses: UserStatus[]): ReturnType<typeof applyDecorators>;

function Authorized(...args: AuthorizedType) {
  let roles: UserRole[] = [];
  let statuses: UserStatus[] = [];
  if (args.length) {
    if (args.some((item) => Object.values(UserRole).includes(item as UserRole))) {
      roles = args as UserRole[];
    } else if (args.some((item) => Object.values(UserStatus).includes(item as UserStatus))) {
      statuses = args as UserStatus[];
    } else if ((args as [UserRole[], UserStatus[]]).every((item) => Array.isArray(item))) {
      roles = args[0] as UserRole[];
      statuses = args[1] as UserStatus[];
    }
  }

  const decorators = [
    UseGuards(JwtAuthGuard),
    ApiBearerAuth(),
    UseGuards(StatusGuard),
    Status(statuses),
  ];

  if (roles?.length) {
    decorators.push(UseGuards(RolesGuard), Roles(...roles));
  }

  return applyDecorators(...decorators);
}

export { Authorized };
