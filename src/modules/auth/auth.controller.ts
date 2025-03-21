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
import { SignInDTO, SignUpDTO } from '../../dto/auth.dto';
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
  @Post('login')
  @Public()
  @UseGuards(LocalAuthGuard)
  @ResponseMessage('Log in successfully')
  async handleLogin(@Request() req) {
    return this.authService.signIn(req.user);
  }
  // @HttpCode(HttpStatus.OK)
  // @Post('login')
  // signIn(@Body() signInDTO: SignInDTO) {
  //   return this.authService.signIn(signInDTO.email, signInDTO.password);
  // }

  @HttpCode(HttpStatus.CREATED)
  @Public()
  @Post('register')
  async signUp(@Body() signUpDTO: SignUpDTO) {
    return this.authService.signUp(signUpDTO);
  }

  // @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  // @Get('mail')
  // async checkMail(@Request() req) {
  //   await this.mailService.sendConfirmationEmail(req.user);
  //   return 'ok';
  // }
}
