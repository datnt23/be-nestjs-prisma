import 'dotenv/config';

export default () => ({
  PORT: process.env.PORT || 3001,
  KEY_ACCESS_TOKEN: process.env.ACCESS_TOKEN_SECRET || '',
  EXPIRES_IN_ACCESS_TOKEN: process.env.JWT_EXPIRES_IN_ACCESS_TOKEN || '2 days',
  KEY_REFRESH_TOKEN: process.env.REFRESH_TOKEN_SECRET || '',
  EXPIRES_IN_REFRESH_TOKEN:
    process.env.JWT_JWT_EXPIRES_IN_REFRESH_TOKEN || '7 days',
  // Admin
  EMAIL_ADMIN: process.env.EMAIL_ADMIN || 'admin@gmail.com',
  PASSWORD_ADMIN: process.env.PASSWORD_ADMIN || 'password',
  FIRST_NAME_ADMIN: process.env.FIRST_NAME_ADMIN || 'Super',
  LAST_NAME_ADMIN: process.env.LAST_NAME_ADMIN || 'Admin',
  FULL_NAME_ADMIN: process.env.FULL_NAME_ADMIN || 'Super Admin',
});
