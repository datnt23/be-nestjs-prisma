import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { keyRoles } from './constants';
import bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import { ForgotPasswordDTO, CodeAuthDTO, SignUpDTO } from '../../dto/auth.dto';
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
    // const user = await this.userService.checkEmailExists(email);

    //? check password matches?
    // const isPasswordMatches = await bcrypt.compare(password, user.password);
    // if (!isPasswordMatches) throw new UnauthorizedException('Invalid password');

    // const user = await this.validateUser(email, password);
    const payload = {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
    };

    return {
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        // display_name: user.display_name,
        // first_name: user.first_name,
        // last_name: user.last_name,
        // roles: user.roles,
        // created_at: dayjs(user.created_at).format('DD-MM-YYYY HH:mm:ss'),
        // updated_at: dayjs(user.updated_at).format('DD-MM-YYYY HH:mm:ss'),
      },
      access_token: this.jwtService.sign(payload),
    };
  }

  async signUp(signUpDTO: SignUpDTO): Promise<any> {
    const codeId = uuidv4();
    const codeExpired = dayjs().add(1, 'minutes').toDate();

    const { email, first_name, last_name, password } = signUpDTO;
    //? check email is exists?
    await this.userService.checkEmailExists(email);

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
    await this.mailService.sendEmail(newUser, codeId);

    return {
      user: {
        id: newUser.id,
        email: newUser.email,
        display_name: newUser.display_name,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        full_name: newUser.full_name,
        roles: newUser.roles,
        created_at: dayjs(newUser.created_at).format('DD-MM-YYYY HH:mm:ss'),
        updated_at: dayjs(newUser.updated_at).format('DD-MM-YYYY HH:mm:ss'),
      },
    };
  }

  async verifyEmail(codeAuthDTO: CodeAuthDTO): Promise<any> {
    const { id, code } = codeAuthDTO;

    //? check user is exists?
    const user = await this.userService.findByIdAndCode(id, code);
    if (!user) throw new BadRequestException('Id or Code is invalid');

    //? check code is expired?
    const isExpired = dayjs().isBefore(user.code_expired);
    if (!isExpired) throw new BadRequestException('Code has expired');

    //* update user is active
    await this.userService.updateOne(id, { is_active: true });

    return;
  }

  async resendVerificationEmail(email: string): Promise<any> {
    //? check user is exists?
    const user = await this.userService.checkEmailExists(email);
    //? check email is active?
    if (user.is_active)
      throw new BadRequestException('Email has been activated');

    const codeId = uuidv4();
    const codeExpired = dayjs().add(1, 'minutes').toDate();

    //* update user
    await this.userService.updateOne(user.id, {
      code_id: codeId,
      code_expired: codeExpired,
    });

    //* send email is confirm
    await this.mailService.sendEmail(user, codeId);

    return {
      id: user.id,
    };
  }

  async forgotPassword(email: string): Promise<any> {
    //? check email is exists?
    const user = await this.userService.checkEmailExists(email);

    const codeId = uuidv4();
    const codeExpired = dayjs().add(1, 'minutes').toDate();

    //* update user
    await this.userService.updateOne(user.id, {
      code_id: codeId,
      code_expired: codeExpired,
    });

    //* send email
    await this.mailService.sendEmail(
      user,
      codeId,
      'Change your password account!',
    );

    return {
      id: user.id,
      email,
    };
  }

  async resetPassword(data: ForgotPasswordDTO): Promise<any> {
    const { code, email, password } = data;
    //? check email is exists?
    const user = await this.userService.findByEmailAndCode(email, code);
    if (!user) throw new BadRequestException('Email or Code is invalid');

    //? check code is expired?
    const isExpired = dayjs().isBefore(user.code_expired);
    if (!isExpired) throw new BadRequestException('Code has expired');

    //* hash password
    const hashPassword = await bcrypt.hash(password, 10);

    //* update password
    await this.userService.updateOne(user.id, {
      password: hashPassword,
    });

    return;
  }
}
