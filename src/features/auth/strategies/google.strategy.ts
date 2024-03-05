import { BadRequestException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-custom';

import { GoogleAuthRequest } from '@/features/auth/dto';
import { GoogleAuthService } from '@/features/auth/services';
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly googleAuthService: GoogleAuthService) {
    super();
  }
  async validate(req: Request<undefined, GoogleAuthRequest>) {
    const { token } = req.body;
    if (!token) {
      throw new BadRequestException('No auth token');
    }

    return await this.googleAuthService.authenticate(token);
  }
}
