import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterProps } from '../auth/types';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email: email } });
  }

  async create({
    email,
    password,
    roles,
    firstName,
    lastName,
    fullName,
    displayName,
  }: RegisterProps) {
    return this.prisma.user.create({
      data: {
        email,
        password,
        roles,
        firstName,
        lastName,
        fullName,
        displayName,
      },
    });
  }

  async getAll(): Promise<User[]> {
    return this.prisma.user.findMany({
      where: {
        NOT: {
          roles: {
            has: 'admin',
          },
        },
      },
    });
  }

  async getById(id: number): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) throw new NotFoundException(`User with ID ${id} not found`);

    return user;
  }

  async update(id: number, data: any) {
    const user = await this.prisma.user.findUnique({
      where: { id: Number(id) },
    });

    if (!user) throw new NotFoundException(`User with ID ${id} not found`);

    const updated = await this.prisma.user.update({
      where: { id: Number(id) },
      data,
    });

    return {
      message: 'User updated successfully',
      status: HttpStatus.OK,
      data: { user: updated },
    };
  }

  async delete(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: Number(id) },
    });

    if (!user) throw new NotFoundException(`User with ID ${id} not found`);

    await this.prisma.user.delete({ where: { id: Number(id) } });

    return {
      message: 'User deleted successfully',
      status: HttpStatus.OK,
    };
  }
}
