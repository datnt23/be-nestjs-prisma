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
import { Public } from './decorator/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @UseGuards(AuthGuard("local"))
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
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
}
