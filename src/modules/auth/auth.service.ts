import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import {
  ForgotPasswordDTO,
  SignUpDTO,
  VerifyEmailDTO,
} from '../../common/dto/auth.dto';
import { MailService } from '../../mail/mail.service';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import { JwtPayload } from './strategy/jwt.strategy';
import { Role } from '../../common/enum/role.enum';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private readonly mailService: MailService,
  ) {}

  async checkCodeIsExpired(user: User): Promise<any> {
    const isExpired = dayjs().isBefore(user.code_expired);
    if (!isExpired) throw new BadRequestException('Code has expired');

    return;
  }

  async createCodeExpired(): Promise<any> {
    const codeId = await uuidv4();
    const codeExpired = await dayjs().add(1, 'minutes').toDate();
    return { codeId, codeExpired };
  }

  async validateUser(email: string, password: string): Promise<any> {
    //? check email is exists?
    const user = await this.userService.findByEmail(email);
    if (!user) return null;

    //? check password matches?
    const isPasswordMatches = await bcrypt.compare(password, user.password);
    if (!isPasswordMatches) return null;

    return user;
  }

  async signIn(user: any): Promise<any> {
    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      user: {
        id: user.id,
        email: user.email,
      },
      access_token: accessToken,
    };
  }

  async signUp(signUpDTO: SignUpDTO): Promise<any> {
    const { email, first_name, last_name, password } = signUpDTO;
    //? check email is exists?
    const user = await this.userService.findByEmail(email);

    if (user) throw new BadRequestException('Email already exists');

    const userRole = await this.prisma.role.findFirst({
      where: { name: Role.USER },
    });

    if (!userRole) throw new BadRequestException('Role not found');

    //* hash password
    const hashPassword = await bcrypt.hash(password, 10);

    const { codeId, codeExpired } = await this.createCodeExpired();

    //* create new user
    const newUser = await this.userService.create({
      email,
      password: hashPassword,
      first_name,
      last_name,
      code_id: codeId,
      code_expired: codeExpired,
      roles: { create: { role_id: userRole.id } },
    });

    //* send email is confirm
    await this.mailService.sendEmail(newUser, codeId);

    return { id: newUser.id, email: newUser.email };
  }

  async verifyEmail(verifyEmailDTO: VerifyEmailDTO): Promise<any> {
    const { id, code } = verifyEmailDTO;

    //? check user is exists?
    const user = await this.userService.findById(id);
    if (!user) throw new BadRequestException('Id is invalid');
    //? check email is active?
    if (user.is_active)
      throw new BadRequestException('Email has been activated');
    //? check code is invalid?
    if (user.code_id !== code) throw new BadRequestException('Code is invalid');

    //? check code is expired?
    await this.checkCodeIsExpired(user);

    //* update user is active
    await this.userService.updateOne(id, { is_active: true });

    return;
  }

  async resendVerificationEmail(email: string): Promise<any> {
    //? check user is exists?
    const user = await this.userService.findByEmail(email);
    if (!user) throw new NotFoundException('Email not found');

    //? check email is active?
    if (user.is_active)
      throw new BadRequestException('Email has been activated');

    const { codeId, codeExpired } = await this.createCodeExpired();

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
    const user = await this.userService.findByEmail(email);
    if (!user) throw new NotFoundException('Email not found');

    const { codeId, codeExpired } = await this.createCodeExpired();

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
    const user = await this.userService.findByEmail(email);
    if (!user) throw new BadRequestException('Email not found');

    //? check code is invalid?
    if (user.code_id !== code) throw new BadRequestException('Code is invalid');

    //? check code is expired?
    await this.checkCodeIsExpired(user);

    //* hash new password
    const newPassword = await bcrypt.hash(password, 10);

    //* update password
    await this.userService.updateOne(user.id, {
      password: newPassword,
    });

    return;
  }

  async getProfile(payload: JwtPayload): Promise<any> {
    const { id } = payload;

    //? check user is exists?
    const user = await this.userService.findById(id);
    if (!user) throw new NotFoundException('User not found');

    //* handle get full name
    const full_name = `${user.first_name} ${user.last_name}`;

    return {
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        full_name,
        roles: user.roles.map((userRole) => userRole.role.name),
        created_at: dayjs(user.created_at).format('DD-MM-YYYY HH:mm:ss'),
        updated_at: dayjs(user.updated_at).format('DD-MM-YYYY HH:mm:ss'),
      },
    };
  }
}
