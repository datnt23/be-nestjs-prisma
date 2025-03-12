import {
  IsEmail,
  IsNotEmpty,
  IsStrongPassword,
  MinLength,
} from 'class-validator';
import { IsTheSameAs } from '../validators/auth';

export class SignInDTO {
  @IsEmail({}, { message: 'Invalid email' })
  @IsNotEmpty({ message: 'email is required' })
  email: string;

  @MinLength(6, { message: 'password must have at least 6 characters' })
  @IsNotEmpty({ message: 'password is required' })
  password: string;
}

export class SignUpDTO {
  @IsNotEmpty({ message: 'firstName is required' })
  firstName: string;

  @IsNotEmpty({ message: 'lastName is required' })
  lastName: string;

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
  @IsNotEmpty({ message: 'confirmPassword is required' })
  confirmPassword: string;
}
