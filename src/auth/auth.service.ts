import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { keyRoles } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, password: string): Promise<any> {
    //? check email is exists?
    const foundUser = await this.usersService.findByEmail(email);
    if (!foundUser) throw new ConflictException();

    //? check password matches?
    const passwordMatches = await bcrypt.compare(password, foundUser.password);
    if (!passwordMatches) throw new UnauthorizedException();

    return foundUser;
  }

  async signUp(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ): Promise<any> {
    //? check email is exists?
    const foundUser = await this.usersService.findByEmail(email);
    if (foundUser) throw new ConflictException('User already exists');

    //* hash password
    const hashPassword: string = await bcrypt.hash(password, 10);

    //* handle get full name
    let fullName = `${firstName} ${lastName}`;

    //* create new user
    const newUser = await this.usersService.create({
      email,
      password: hashPassword,
      roles: [keyRoles.GUEST],
      firstName,
      lastName,
      fullName,
      displayName: lastName,
    });

    return newUser;
  }
}
