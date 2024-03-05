import { BadRequestException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-custom';

import { LinkedinAuthRequest } from '@/features/auth/dto';
import { LinkedinAuthService } from '@/features/auth/services';
@Injectable()
export class LinkedinStrategy extends PassportStrategy(Strategy, 'linkedin') {
  constructor(private readonly linkedinAuthService: LinkedinAuthService) {
    super();
  }
  async validate(req: Request<undefined, LinkedinAuthRequest>) {
    const { code, redirect } = req.body;
    if (!code) {
      throw new BadRequestException('No auth code');
    }

    if (!redirect) {
      throw new BadRequestException('No auth redirect url');
    }

    return await this.linkedinAuthService.authenticate(code, redirect);
  }
}
