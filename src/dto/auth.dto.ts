import {
  IsEmail,
  IsNotEmpty,
  IsStrongPassword,
  MinLength,
} from 'class-validator';
import { IsTheSameAs } from '../decorator/auth.decorator';

export class SignInDTO {
  @IsEmail({}, { message: 'Invalid email' })
  @IsNotEmpty({ message: 'email is required' })
  email: string;

  @MinLength(6, { message: 'password must have at least 6 characters' })
  @IsNotEmpty({ message: 'password is required' })
  password: string;
}

export class SignUpDTO {
  @IsNotEmpty({ message: 'first_name is required' })
  first_name: string;

  @IsNotEmpty({ message: 'last_name is required' })
  last_name: string;

  @IsEmail({}, { message: 'Invalid email' })
  @IsNotEmpty({ message: 'email is required' })
  email: string;

  @IsStrongPassword(
    {
      minLength: 6,
      minUppercase: 1,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        'password must be at least 6 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character (@, $, !, %, *, ?, &...)',
    },
  )
  @IsNotEmpty({ message: 'password is required' })
  password: string;

  @IsTheSameAs('password', { message: "Password doesn't match" })
  @IsNotEmpty({ message: 'confirm_password is required' })
  confirm_password: string;
}

export class CodeAuthDTO {
  @IsNotEmpty({ message: 'id is required' })
  id: number;

  @IsNotEmpty({ message: 'code is required' })
  code: string;
}

export class EmailDTO {
  @IsEmail({}, { message: 'Invalid email' })
  @IsNotEmpty({ message: 'email is required' })
  email: string;
}
