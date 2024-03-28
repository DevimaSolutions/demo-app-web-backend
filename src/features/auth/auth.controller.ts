import { Body, Controller, Get, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

import { Authorized } from './decorators';
import {
  ConfirmEmailRequest,
  ForgotPasswordRequest,
  GoogleAuthRequest,
  LinkedinAuthRequest,
  RefreshTokenRequest,
  ResetPasswordRequest,
  SignInRequest,
  SignUpRequest,
} from './dto';
import { GoogleAuthGuard, LinkedinAuthGuard, LocalAuthGuard } from './guards';
import { IRequestWithUser } from './interfaces';
import { AuthService } from './services';

import { UserStatus } from '@/features/auth/enums';
import {
  confirmEmailSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  signupSchema,
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
  @Authorized(undefined, [UserStatus.Pending])
  async confirmEmail(
    @Req() req: IRequestWithUser,
    @Body(new JoiValidationPipe(confirmEmailSchema)) { code }: ConfirmEmailRequest,
  ): Promise<MessageResponse> {
    return this.authService.verifyEmail(req.user.id, code);
  }

  @Authorized(undefined, [UserStatus.Pending])
  @Post('confirm/email/resend')
  async resendConfirmEmail(@Req() req: IRequestWithUser): Promise<MessageResponse> {
    return this.authService.sendVerifyEmail(req.user.id);
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
  async refreshAccessToken(@Body() refreshTokenDto: RefreshTokenRequest) {
    return this.authService.refreshAccessToken(refreshTokenDto.refreshToken);
  }

  @Authorized(undefined, [UserStatus.Active, UserStatus.Pending, UserStatus.Verified])
  @Get('profile')
  getProfile(@Req() req: IRequestWithUser) {
    return new UserResponse(req.user);
  }
}
