import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PermissionService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    // const permissions = await this.prisma.permission.findMany({
    //   include: {
    //     roles: {
    //       include: {
    //         role: {
    //           select: { id: true, name: true },
    //         },
    //       },
    //     },
    //   },
    // });
    // return await permissions.map((permission) => ({
    //   ...permission,
    //   roles: permission.roles.map((pr) => pr.role),
    // }));

    return await this.prisma.permission.findMany();
  }

  async findOne(id: string) {
    const permission = await this.prisma.permission.findUnique({
      where: { id },
      // include: {
      //   roles: {
      //     include: {
      //       role: {
      //         select: { id: true, name: true },
      //       },
      //     },
      //   },
      // },
    });
    if (!permission) throw new NotFoundException('Permission not found');

    return {
      ...permission,
      // roles: permission.roles.map((pr) => pr.role)
    };
  }

  async create(name: string) {
    const existingPermission = await this.prisma.permission.findFirst({
      where: { name },
    });
    if (existingPermission)
      throw new NotFoundException('Permission already exists');

    return await this.prisma.permission.create({ data: { name } });
  }

  async update(id: string, name: string) {
    const permission = await this.prisma.permission.findUnique({
      where: { id },
    });
    if (!permission) throw new NotFoundException('Permission not found');

    const existingPermission = await this.prisma.permission.findFirst({
      where: { name },
    });
    if (existingPermission && existingPermission.id !== id)
      throw new ConflictException('Permission name already in use');

    return await this.prisma.permission.update({
      where: { id },
      data: { name },
    });
  }

  async remove(id: string) {
    const permission = await this.prisma.permission.findUnique({
      where: { id },
    });
    if (!permission) throw new NotFoundException('Permission not found');

    await this.prisma.permission.delete({ where: { id } });

    return;
  }
}
