import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { ROLES_KEY } from '../../../common/decorator/roles.decorator';
import { PrismaService } from '../../../modules/prisma/prisma.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.get<string[]>(
      ROLES_KEY,
      context.getHandler(),
    );

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const userId = request.user.id;
    if (!userId) throw new ForbiddenException('You are not logged in');

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { roles: { include: { role: true } } },
    });
    if (!user) throw new ForbiddenException('Invalid account');

    const userRoles = user.roles.map((ur) => ur.role.name);
    const hasRole = userRoles.some((userRole) =>
      requiredRoles.includes(userRole),
    );
    if (!hasRole)
      throw new ForbiddenException('You do not have permission to access');

    return true;
  }
}
