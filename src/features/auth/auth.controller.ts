import { Controller, Post, UseGuards, Req, Body, Get } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiBody } from '@nestjs/swagger';

import { Authorized } from './decorators';
import { GoogleAuthRequest, RefreshTokenDto, SignInDto } from './dto';
import { GoogleAuthGuard, LocalAuthGuard } from './guards';
import { IRequestWithUser } from './interfaces';
import { AuthService } from './services';

import { UserResponse } from '@/features/users';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  @ApiBody({ type: SignInDto })
  async signIn(@Req() req: IRequestWithUser) {
    return this.authService.signIn(req.user);
  }

  @Post('google')
  @UseGuards(GoogleAuthGuard)
  @ApiBody({ type: GoogleAuthRequest })
  async google(@Req() req: IRequestWithUser) {
    return this.authService.createJwtTokenPair(req.user);
  }

  @ApiOperation({
    description: 'Generates new auth token pair using valid refresh token',
  })
  @Post('refresh')
  async refreshAccessToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshAccessToken(refreshTokenDto.refreshToken);
  }

  @Authorized()
  @Get('profile')
  getProfile(@Req() req: IRequestWithUser) {
    return new UserResponse(req.user);
  }
}
