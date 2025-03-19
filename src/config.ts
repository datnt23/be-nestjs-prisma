import 'dotenv/config';

// export const env: any = {
//   dev: 'development',
//   pro: 'production',
//   port: 3001,
// };

// export const KEY_ACCESS_TOKEN: string = process.env.ACCESS_TOKEN_SECRET || '';
// export const EXPIRES_IN_ACCESS_TOKEN: string =
//   process.env.JWT_EXPIRES_IN_ACCESS_TOKEN || '2 days';
// export const KEY_REFRESH_TOKEN: string = process.env.REFRESH_TOKEN_SECRET || '';
// export const EXPIRES_IN_REFRESH_TOKEN: string =
//   process.env.JWT_JWT_EXPIRES_IN_REFRESH_TOKEN || '7 days';

// Admin
export const EMAIL_ADMIN: string = process.env.EMAIL_ADMIN || 'admin@gmail.com';
export const PASSWORD_ADMIN: string = process.env.PASSWORD_ADMIN || 'password';
export const FIRST_NAME_ADMIN: string = process.env.FIRST_NAME_ADMIN || 'Super';
export const LAST_NAME_ADMIN: string = process.env.LAST_NAME_ADMIN || 'Admin';
export const FULL_NAME_ADMIN: string =
  process.env.FULL_NAME_ADMIN || 'Super Admin';
