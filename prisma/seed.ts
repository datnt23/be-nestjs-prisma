import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import {
  EMAIL_ADMIN,
  FIRSTNAME_ADMIN,
  FULLNAME_ADMIN,
  LASTNAME_ADMIN,
  PASSWORD_ADMIN,
} from '../src/config';
import { keyRoles } from '../src/auth/constants';

const prisma: PrismaClient = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      email: EMAIL_ADMIN,
      password: await bcrypt.hash(PASSWORD_ADMIN, 10),
      roles: [keyRoles.ADMIN],
      firstName: FIRSTNAME_ADMIN,
      lastName: LASTNAME_ADMIN,
      fullName: FULLNAME_ADMIN,
      displayName: LASTNAME_ADMIN,
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
