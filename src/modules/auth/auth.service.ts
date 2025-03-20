import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { format } from 'date-fns';
import { keyRoles } from './constants';
import bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import { SignUpDTO } from '../../dto/auth.dto';
import { MailService } from '../../mail/mail.service';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private readonly mailService: MailService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    //? check email is exists?
    const user = await this.userService.findByEmail(email);
    //? check password matches?
    const isPasswordMatches = await bcrypt.compare(password, user.password);

    if (!user || !isPasswordMatches) return null;

    return user;
  }

  async signIn(user: any): Promise<any> {
    //? check email is exists?
    // const user = await this.userService.findByEmail(email);
    // if (!user) throw new BadRequestException('User not found');

    //? check password matches?
    // const isPasswordMatches = await bcrypt.compare(password, user.password);
    // if (!isPasswordMatches) throw new UnauthorizedException('Invalid password');

    // const user = await this.validateUser(email, password);
    const payload = {
      userId: user.id,
      email: user.email,
      name: user.full_name,
    };
    return {
      // user: {
      //   id: user.id,
      //   email: user.email,
      //   first_name: user.first_name,
      //   last_name: user.last_name,
      //   full_name: user.full_name,
      //   display_name: user.display_name,
      //   roles: user.roles,
      //   created_at: format(user.created_at, 'dd-MM-yyyy ss:mm:HH'),
      //   updated_at: format(user.updated_at, 'dd-MM-yyyy ss:mm:HH'),
      // },
      access_token: this.jwtService.sign(payload),
    };
  }

  async signUp(signUpDTO: SignUpDTO): Promise<any> {
    const codeId = uuidv4();
    const codeExpired = dayjs().add(30, 'seconds').toDate();

    const { email, first_name, last_name, password } = signUpDTO;
    //? check email is exists?
    const foundUser = await this.userService.findByEmail(email);
    if (foundUser) throw new BadRequestException('User already exists');

    //* hash password
    const hashPassword = await bcrypt.hash(password, 10);

    //* handle get full name
    const full_name = `${first_name} ${last_name}`;

    //* create new user
    const newUser = await this.userService.create({
      email,
      password: hashPassword,
      roles: [keyRoles.GUEST],
      first_name,
      last_name,
      full_name,
      display_name: last_name,
      code_id: codeId,
      code_expired: codeExpired,
    });

    //* send email is confirm
    await this.mailService.sendConfirmationEmail(newUser, codeId);

    return {
      user: {
        id: newUser.id,
        email: newUser.email,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        full_name: newUser.full_name,
        display_name: newUser.display_name,
        roles: newUser.roles,
        created_at: format(newUser.created_at, 'dd-MM-yyyy ss:mm:HH'),
        updated_at: format(newUser.updated_at, 'dd-MM-yyyy ss:mm:HH'),
      },
    };
  }
}
