import 'dotenv/config';

export default () => ({
  PORT: process.env.PORT || 3001,
  KEY_ACCESS_TOKEN: process.env.ACCESS_TOKEN_SECRET || '',
  EXPIRES_IN_ACCESS_TOKEN: process.env.JWT_EXPIRES_IN_ACCESS_TOKEN || '2 days',
  KEY_REFRESH_TOKEN: process.env.REFRESH_TOKEN_SECRET || '',
  EXPIRES_IN_REFRESH_TOKEN:
    process.env.JWT_JWT_EXPIRES_IN_REFRESH_TOKEN || '7 days',
});

// Admin
export const EMAIL_ADMIN: string = process.env.EMAIL_ADMIN || 'admin@gmail.com';
export const PASSWORD_ADMIN: string = process.env.PASSWORD_ADMIN || 'password';
export const FIRST_NAME_ADMIN: string = process.env.FIRST_NAME_ADMIN || 'Super';
export const LAST_NAME_ADMIN: string = process.env.LAST_NAME_ADMIN || 'Admin';
