import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy as PassportLocalStrategy } from 'passport-local';

import { AuthService } from '@/features/auth/services';
import { errorMessages } from '@/features/common';

// This strategy is responsible for logging in user with email and password
@Injectable()
export class LocalStrategy extends PassportStrategy(PassportLocalStrategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string) {
    const user = await this.authService.validateUser(email.toLowerCase(), password);
    if (!user || user.isBlocked) {
      throw new UnauthorizedException(errorMessages.loginFailed);
    }
    return user;
  }
}
