import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { users } from '@prisma/client';
import { CreateUserProps } from './types';
import { PaginationDTO } from '../../dto/pagination.dto';
import { getSelectData } from '../../util';
import aqp from 'api-query-params';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string): Promise<any> {
    return await this.prisma.users.findUnique({ where: { email: email } });
  }

  async findOne(id: number): Promise<users | null> {
    return await this.prisma.users.findUnique({ where: { id } });
  }

  async findAllNotAdmin({
    query,
    page = 1,
    limit = 10,
    sort = 'id',
    order = 'desc',
    select = [],
  }: {
    query: string;
    page?: number;
    limit?: number;
    sort?: string;
    order?: string;
    search?: string;
    select?: string[];
  }): Promise<any> {
    const { filter } = aqp(query);

    if (filter.page) delete filter.page;
    if (filter.order) delete filter.order;

    const insensitiveFields = ['email', 'full_name', 'display_name'];
    for (const field of insensitiveFields) {
      if (filter[field]) {
        filter[field] = {
          contains: filter[field],
          mode: 'insensitive',
        };
      }
    }

    const whereCondition = {
      ...filter,
      deleted_at: null,
      NOT: {
        roles: {
          has: 'admin',
        },
      },
    };

    const skip = (page - 1) * limit;
    const sortBy = { [sort]: order };

    const totalItems = await this.prisma.users.count({
      where: whereCondition,
    });
    const totalPages = Math.ceil(totalItems / limit);

    const data = await this.prisma.users.findMany({
      where: whereCondition,
      take: limit,
      skip,
      orderBy: sortBy,
      omit: getSelectData(select),
    });

    return { data, total_pages: totalPages, total_items: totalItems };
  }

  async create({
    email,
    password,
    roles,
    first_name,
    last_name,
    full_name,
    display_name,
    code_id,
    code_expired,
  }: CreateUserProps) {
    return await this.prisma.users.create({
      data: {
        email,
        password,
        roles,
        first_name,
        last_name,
        full_name,
        display_name,
        is_active: false,
        code_id,
        code_expired,
      },
    });
  }

  async getAll(query: string, paginationDTO: PaginationDTO): Promise<any> {
    return await this.findAllNotAdmin({
      query,
      ...paginationDTO,
      select: ['password', 'deleted_at'],
    });
  }

  async getById(id: number): Promise<any> {
    const user = await this.findOne(id);

    if (!user) throw new NotFoundException(`User with ID ${id} not found`);

    return user;
  }

  async update(id: number, data: any) {
    const user = await this.findOne(id);

    if (!user) throw new NotFoundException(`User with ID ${id} not found`);

    const updated = await this.prisma.users.update({
      where: { id },
      data,
    });

    return {
      message: 'User updated successfully',
      status: HttpStatus.OK,
      data: { user: updated },
    };
  }

  async deleteAt(id: number) {
    const user = await this.findOne(id);

    if (!user) throw new NotFoundException(`User with ID ${id} not found`);

    await this.prisma.users.update({
      where: { id },
      data: {
        deleted_at: new Date(),
      },
    });

    return {
      message: 'User deleted successfully',
      status: HttpStatus.OK,
    };
  }

  async restore(id: number) {
    const user = await this.findOne(id);

    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    if (!user.deleted_at) throw new BadRequestException('User is not deleted');

    await this.prisma.users.update({
      where: { id },
      data: {
        deleted_at: null,
      },
    });

    return {
      message: 'User restored successfully',
      status: HttpStatus.OK,
    };
  }

  async delete(id: number) {
    const user = await this.findOne(id);

    if (!user) throw new NotFoundException(`User with ID ${id} not found`);

    await this.prisma.users.delete({ where: { id } });

    return {
      message: 'User deleted in database successfully',
      status: HttpStatus.OK,
    };
  }
}
