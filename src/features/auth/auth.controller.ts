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
import { UserProfileResponse } from '@/features/profiles/dto/responses';
import { JoiValidationPipe } from '@/pipes';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  @ApiOperation({ summary: 'Password authentication' })
  @ApiBody({ type: SignInRequest })
  async signIn(@Req() req: IRequestWithUser) {
    return this.authService.signIn(req.user);
  }

  @Post('sign-up')
  @ApiOperation({ summary: 'Sign up as the new user.' })
  async signUp(@Body(new JoiValidationPipe(signupSchema)) request: SignUpRequest) {
    return this.authService.signUp(request);
  }
  @Post('confirm/email')
  @Authorized(UserStatus.Pending)
  @ApiOperation({
    description:
      '### You will be able to use this operation only when the user is in the *pending status*',
    summary: 'Confirm email.',
  })
  async confirmEmail(
    @Req() req: IRequestWithUser,
    @Body(new JoiValidationPipe(confirmEmailSchema)) { code }: ConfirmEmailRequest,
  ): Promise<MessageResponse> {
    return this.authService.verifyEmail(req.user.id, code);
  }

  @Authorized(UserStatus.Pending)
  @Post('confirm/email/resend')
  @ApiOperation({
    description:
      '### You will be able to use this operation only when the user is in the *pending status*',
    summary: 'Resend confirmation email.',
  })
  async resendConfirmEmail(@Req() req: IRequestWithUser): Promise<MessageResponse> {
    return this.authService.sendVerifyEmail(req.user.id);
  }

  @Post('google')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({
    summary: 'Google authentication.',
  })
  @ApiBody({ type: GoogleAuthRequest })
  async google(@Req() req: IRequestWithUser) {
    return this.authService.createJwtTokenPair(req.user);
  }

  @Post('linkedin')
  @ApiOperation({
    summary: 'Linkedin authentication.',
  })
  @UseGuards(LinkedinAuthGuard)
  @ApiBody({ type: LinkedinAuthRequest })
  async linkedin(@Req() req: IRequestWithUser) {
    return this.authService.createJwtTokenPair(req.user);
  }

  @Post('password/forgot')
  @ApiOperation({ summary: 'Forgot password request.' })
  async forgotPassword(
    @Body(new JoiValidationPipe(forgotPasswordSchema)) { email }: ForgotPasswordRequest,
  ): Promise<MessageResponse> {
    return this.authService.sendForgotPasswordEmail(email);
  }

  @Put('password/reset')
  @ApiOperation({ summary: 'Reset password request.' })
  async resetPassword(
    @Body(new JoiValidationPipe(resetPasswordSchema)) { token, password }: ResetPasswordRequest,
  ): Promise<MessageResponse> {
    return this.authService.resetPassword(token, password);
  }

  @ApiOperation({
    summary: 'Get a new access token by the refresh token.',
    description: 'Generates new auth token pair using valid refresh token.',
  })
  @Post('refresh')
  async refreshAccessToken(@Body() refreshTokenDto: RefreshTokenRequest) {
    return this.authService.refreshAccessToken(refreshTokenDto.refreshToken);
  }

  @Authorized(UserStatus.Active, UserStatus.Pending, UserStatus.Verified)
  @Get('profile')
  @ApiOperation({
    summary: 'Get the currently logged user.',
  })
  getProfile(@Req() req: IRequestWithUser) {
    return new UserProfileResponse(req.user);
  }
}
