import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';

@Injectable()
export class RoleService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  async create(name: string) {
    const existingRole = await this.prisma.role.findFirst({
      where: { name },
    });
    if (existingRole) throw new NotFoundException('Role already exists');

    return this.prisma.role.create({
      data: { name },
    });
  }

  async findAll() {
    const roles = await this.prisma.role.findMany({
      include: {
        permissions: {
          include: {
            permission: { select: { id: true, name: true } },
          },
        },
        users: {
          include: {
            user: { select: { id: true, email: true } },
          },
        },
      },
    });
    return await roles.map((role) => ({
      ...role,
      permissions: role.permissions.map((rp) => rp.permission),
      users: role.users.map((ur) => ur.user),
    }));

    // return await this.prisma.role.findMany();
  }

  async checkRoleExists(id: string) {
    const role = await this.prisma.role.findUnique({
      where: { id },
    });
    if (!role) throw new NotFoundException('Role not found');
  }

  async findOne(id: string) {
    const role = await this.prisma.role.findUnique({
      where: { id },
      // include: {
      //   permissions: {
      //     include: {
      //       permission: { select: { id: true, name: true } },
      //     },
      //   },
      //   users: {
      //     include: {
      //       user: { select: { id: true, email: true } },
      //     },
      //   },
      // },
    });
    if (!role) throw new NotFoundException('Role not found');

    return {
      ...role,
      // permissions: role.permissions.map((rp) => rp.permission),
      // users: role.users.map((ur) => ur.user),
    };
  }

  async update(id: string, name: string) {
    const role = await this.prisma.role.findUnique({
      where: { id },
    });
    if (!role) throw new NotFoundException('Role not found');

    const existingRole = await this.prisma.role.findFirst({
      where: { name },
    });
    if (existingRole && existingRole.id !== id)
      throw new ConflictException('Role name already in use');

    return this.prisma.role.update({
      where: { id },
      data: { name },
    });
  }

  async remove(id: string) {
    const role = await this.prisma.role.findUnique({
      where: { id },
    });
    if (!role) throw new NotFoundException('Role not found');

    await this.prisma.role.delete({ where: { id } });

    return;
  }

  async assignPermissionToRole(roleId: string, permissionIds: string[]) {
    const existingRole = await this.prisma.role.findUnique({
      where: { id: roleId },
    });
    if (!existingRole) throw new NotFoundException('Role not found');

    const permissions = await this.prisma.permission.findMany({
      where: {
        id: { in: permissionIds },
      },
      select: { id: true, name: true },
    });

    const foundPermissionIds = permissions.map((p) => p.id);
    const missingPermissionIds = permissionIds.filter(
      (id) => !foundPermissionIds.includes(id),
    );

    if (missingPermissionIds.length > 0)
      throw new NotFoundException(
        `Permissions not found: ${missingPermissionIds.join(', ')}`,
      );

    const updatedRole = await this.prisma.role.update({
      where: { id: roleId },
      data: {
        permissions: {
          create: permissionIds.map((permissionId) => ({
            permission_id: permissionId,
          })),
        },
      },
      include: {
        permissions: {
          include: {
            permission: { select: { id: true, name: true } },
          },
        },
      },
    });

    return {
      ...updatedRole,
      permissions: updatedRole.permissions.map((rp) => rp.permission),
    };
  }

  async assignRoleToUser(userId: string, roleId: string) {
    //? check user is exists?
    await this.userService.checkUserIdExists(userId);

    //? check role is exists?
    await this.checkRoleExists(roleId);

    const updatedUser = await this.userService.update(userId, {
      roles: {
        create: {
          role_id: roleId,
        },
      },
    });
    return updatedUser;
  }
}
