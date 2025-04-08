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
  EmailDTO,
  SignInDTO,
  SignUpDTO,
  VerifyEmailDTO,
} from '../../common/dto/auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { Public } from '../../common/decorator/public.decorator';
import { ResponseMessage } from '../../common/decorator/response_message.decorator';
import { Roles } from '../../common/decorator/roles.decorator';
import { Permissions } from '../../common/decorator/permissions.decorator';
import { Permission } from '../../common/enum/permission.enum';
import { Role } from '../../common/enum/role.enum';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @UseGuards(AuthGuard("local"))
  @Public()
  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ResponseMessage('Login successfully')
  async handleLogin(@Body() signInDTO: SignInDTO, @Request() req) {
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
  @ResponseMessage('Email code verified successfully')
  async verifyEmail(@Body() verifyEmailDTO: VerifyEmailDTO) {
    return this.authService.verifyEmail(verifyEmailDTO);
  }

  @Public()
  @Post('resend-verification')
  @ResponseMessage('Verification code sent to new email')
  async resendVerification(@Body() body: EmailDTO) {
    return this.authService.resendVerificationEmail(body.email);
  }

  @Public()
  @Post('forgot-password')
  @ResponseMessage('Password reset code sent to your email')
  async forgotPassword(@Body() body: EmailDTO) {
    return this.authService.forgotPassword(body.email);
  }

  @Public()
  @Post('reset-password')
  @ResponseMessage('A reset password code has been sent to the email')
  async resetPassword(@Body() body: ForgotPasswordDTO) {
    return this.authService.resetPassword(body);
  }

  @Get('profile')
  @Roles(Role.USER, Role.ADMIN)
  @Permissions(Permission.VIEW_PROFILE)
  @ResponseMessage('Get profile successfully')
  getProfile(@Request() req) {
    return this.authService.getProfile(req.user);
  }
}
