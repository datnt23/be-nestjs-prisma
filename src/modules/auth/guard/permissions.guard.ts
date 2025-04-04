import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../../../common/decorator/permissions.decorator';
import { PrismaService } from '../../../modules/prisma/prisma.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.get<string[]>(
      PERMISSIONS_KEY,
      context.getHandler(),
    );
    if (!requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const userId = request.user.id;
    if (!userId) throw new ForbiddenException('You are not logged in');

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: { permission: true },
                },
              },
            },
          },
        },
      },
    });
    if (!user) throw new ForbiddenException('Invalid account');

    const userPermissions = user.roles
      .flatMap((userRole) => userRole.role.permissions)
      .map((rolePermission) => rolePermission.permission.name);
    const hasPermission = requiredPermissions.some((perm) =>
      userPermissions.includes(perm),
    );
    if (!hasPermission)
      throw new ForbiddenException('You do not have permission to access');

    return true;
  }
}
