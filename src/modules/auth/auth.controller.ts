import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ForgotPasswordDTO,
  CodeAuthDTO,
  EmailDTO,
  SignInDTO,
  SignUpDTO,
} from '../../dto/auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { Public } from '../../decorator/public.decorator';
import { MailService } from '../../mail/mail.service';
import { ResponseMessage } from '../../decorator/response_message.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailService: MailService,
  ) {}

  // @UseGuards(AuthGuard("local"))
  @Public()
  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Login successfully')
  async handleLogin(@Request() req) {
    return this.authService.signIn(req.user);
  }
  // @Post('login')
  // signIn(@Body() signInDTO: SignInDTO) {
  //   return this.authService.signIn(signInDTO.email, signInDTO.password);
  // }

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage('Registration successfully')
  async signUp(@Body() signUpDTO: SignUpDTO) {
    return this.authService.signUp(signUpDTO);
  }

  @Public()
  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Email code verified successfully')
  async verifyEmail(@Body() codeAuthDTO: CodeAuthDTO) {
    return this.authService.verifyEmail(codeAuthDTO);
  }

  @Public()
  @Post('resend-verification')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Verification code sent to new email')
  async resendVerification(@Body() body: EmailDTO) {
    return this.authService.resendVerificationEmail(body.email);
  }

  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Password reset code sent to your email')
  async forgotPassword(@Body() body: EmailDTO) {
    return this.authService.forgotPassword(body.email);
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('A reset password code has been sent to the email')
  async resetPassword(@Body() body: ForgotPasswordDTO) {
    return this.authService.resetPassword(body);
  }

  // @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
