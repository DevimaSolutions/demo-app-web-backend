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

/**
 * Protect endpoint using bearer JWT auth.
 * @param roles list of roles that are allowed to execute on decorated action. Leave empty to allow access for any role
 * @param statuses list of statuses that are allowed to execute on decorated action. Leave empty to allow access for only user active
 */
export const Authorized = (
  roles: UserRole[] | undefined = undefined,
  statuses: UserStatus[] | undefined = undefined,
) => {
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
};
