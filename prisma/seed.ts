import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { keyRoles } from '../src/modules/auth/constants';
import {
  EMAIL_ADMIN,
  FIRST_NAME_ADMIN,
  FULL_NAME_ADMIN,
  LAST_NAME_ADMIN,
  PASSWORD_ADMIN,
} from '../src/config/configuration';

const prisma: PrismaClient = new PrismaClient();

async function main() {
  await prisma.users.create({
    data: {
      email: EMAIL_ADMIN,
      password: await bcrypt.hash(PASSWORD_ADMIN, 10),
      roles: [keyRoles.ADMIN],
      first_name: FIRST_NAME_ADMIN,
      last_name: LAST_NAME_ADMIN,
      full_name: FULL_NAME_ADMIN,
      display_name: LAST_NAME_ADMIN,
      is_active: true,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
