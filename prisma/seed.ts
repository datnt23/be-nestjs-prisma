import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import {
  EMAIL_ADMIN,
  FIRST_NAME_ADMIN,
  LAST_NAME_ADMIN,
  PASSWORD_ADMIN,
} from '../src/config/configuration';
import { Role } from '../src/common/enum/role.enum';
import { Permission } from '../src/common/enum/permission.enum';

const prisma: PrismaClient = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  await prisma.$executeRawUnsafe(
    'TRUNCATE TABLE "UserRole", "RolePermission", "Permission", "Role", "User" RESTART IDENTITY CASCADE',
  ); // This will delete all data from the tables and reset the auto-incrementing primary key.

  const roles = [
    {
      name: Role.ADMIN,
    },
    {
      name: Role.MANAGER,
    },
    {
      name: Role.USER,
    },
  ];

  await prisma.role.createMany({
    data: roles,
  });

  const permissions = [
    { name: Permission.VIEW_PROFILE },
    { name: Permission.GET_USERS },
    { name: Permission.GET_USER_BY_ID },
    { name: Permission.UPDATE_USER },
    { name: Permission.SOFT_DELETE_USER },
    { name: Permission.RESTORE_USER },
    { name: Permission.HARD_DELETE_USER },
  ];

  await prisma.permission.createMany({ data: permissions });

  const allRoles = await prisma.role.findMany();
  const allPermissions = await prisma.permission.findMany();

  const hashPassword = await bcrypt.hash(PASSWORD_ADMIN, 10);

  const adminRole = await allRoles.find((role) => role.name === Role.ADMIN);

  if (adminRole) {
    await prisma.rolePermission.createMany({
      data: allPermissions.map((perm) => ({
        role_id: adminRole.id,
        permission_id: perm.id,
      })),
    });
  }

  await prisma.user.create({
    data: {
      email: EMAIL_ADMIN,
      password: hashPassword,
      first_name: FIRST_NAME_ADMIN,
      last_name: LAST_NAME_ADMIN,
      is_active: true,
      roles: {
        create: allRoles.map((role) => ({ role_id: role.id })),
      },
    },
  });

  console.log('Seeding completed!');
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
