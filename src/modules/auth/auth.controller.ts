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
import { CodeAuthDTO, SignInDTO, SignUpDTO } from '../../dto/auth.dto';
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
  @Post('check-code')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Email code verified successfully')
  async checkCode(@Body() codeAuthDTO: CodeAuthDTO) {
    return this.authService.checkCode(codeAuthDTO);
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
