import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { UserStatus } from '@/features/auth';
import { STATUS_KEY } from '@/features/auth/decorators';
import { IRequestWithUser } from '@/features/auth/interfaces';

@Injectable()
export class StatusGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredStatus = this.reflector.getAllAndOverride<UserStatus[]>(STATUS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const { user } = context.switchToHttp().getRequest<IRequestWithUser>();
    if (!user) {
      // user is not even authenticated
      return false;
    }

    return requiredStatus.includes(user.status);
  }
}
