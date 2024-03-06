import { Controller, Post, UseGuards, Req, Body, Get, Put } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiBody } from '@nestjs/swagger';

import { Authorized } from './decorators';
import {
  ForgotPasswordRequest,
  GoogleAuthRequest,
  LinkedinAuthRequest,
  RefreshTokenDto,
  ResetPasswordRequest,
  SignInDto,
} from './dto';
import { GoogleAuthGuard, LocalAuthGuard, LinkedinAuthGuard } from './guards';
import { IRequestWithUser } from './interfaces';
import { AuthService } from './services';

import { forgotPasswordSchema, resetPasswordSchema } from '@/features/auth/validations';
import { MessageResponse } from '@/features/common';
import { UserResponse } from '@/features/users';
import { JoiValidationPipe } from '@/pipes';

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

  @Post('linkedin')
  @UseGuards(LinkedinAuthGuard)
  @ApiBody({ type: LinkedinAuthRequest })
  async linkedin(@Req() req: IRequestWithUser) {
    return this.authService.createJwtTokenPair(req.user);
  }

  @Post('password/forgot')
  @ApiOperation({ description: 'Forgot password request' })
  async forgotPassword(
    @Body(new JoiValidationPipe(forgotPasswordSchema)) { email }: ForgotPasswordRequest,
  ): Promise<MessageResponse> {
    return this.authService.sendForgotPasswordEmail(email);
  }

  @Put('password/reset')
  @ApiOperation({ description: 'Reset password request' })
  async resetPassword(
    @Body(new JoiValidationPipe(resetPasswordSchema)) { token, password }: ResetPasswordRequest,
  ): Promise<MessageResponse> {
    return this.authService.resetPassword(token, password);
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
