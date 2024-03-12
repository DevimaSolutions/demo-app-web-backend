import { Controller, Post, UseGuards, Req, Body, Get, Put } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiBody } from '@nestjs/swagger';

import { Authorized } from './decorators';
import {
  ForgotPasswordRequest,
  GoogleAuthRequest,
  LinkedinAuthRequest,
  RefreshTokenDto,
  ResetPasswordRequest,
  SignInRequest,
  SignUpRequest,
  ConfirmEmailRequest,
} from './dto';
import { GoogleAuthGuard, LocalAuthGuard, LinkedinAuthGuard } from './guards';
import { IRequestWithUser } from './interfaces';
import { AuthService } from './services';

import {
  forgotPasswordSchema,
  resetPasswordSchema,
  signupSchema,
  confirmEmailSchema,
} from '@/features/auth/validations';
import { MessageResponse } from '@/features/common';
import { UserResponse } from '@/features/users';
import { JoiValidationPipe } from '@/pipes';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  @ApiBody({ type: SignInRequest })
  async signIn(@Req() req: IRequestWithUser) {
    return this.authService.signIn(req.user);
  }

  @Post('sign-up')
  async signUp(@Body(new JoiValidationPipe(signupSchema)) request: SignUpRequest) {
    return this.authService.signUp(request);
  }
  @Post('confirm/email')
  @Authorized()
  async confirmEmail(
    @Req() req: IRequestWithUser,
    @Body(new JoiValidationPipe(confirmEmailSchema)) { code }: ConfirmEmailRequest,
  ): Promise<MessageResponse> {
    return this.authService.verifyEmail(req.user.id, code);
  }

  @Authorized()
  @Post('confirm/email/resend')
  async resendConfirmEmail(@Req() req: IRequestWithUser): Promise<MessageResponse> {
    return this.authService.sendVerifyEmail(req.user);
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
