import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, users } from '@prisma/client';
import { CreateUserProps, FindUserProps } from './types';
import { PaginationDTO } from '../../dto/pagination.dto';
import { getSelectData } from '../../util';
import aqp from 'api-query-params';
import { CodeAuthDTO } from 'src/dto/auth.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string): Promise<any> {
    return await this.prisma.users.findUnique({ where: { email: email } });
  }

  async findOne(payload: Prisma.usersWhereInput): Promise<users | null> {
    return await this.prisma.users.findFirst({ where: payload });
  }

  async findByIdAndCode(id: number, code: string): Promise<users | null> {
    return await this.prisma.users.findUnique({ where: { id, code_id: code } });
  }

  async findAllNotAdmin({
    query,
    page = 1,
    limit = 10,
    sort = 'id',
    order = 'asc',
    unSelect = [],
  }: {
    query: string;
    page?: number;
    limit?: number;
    sort?: string;
    order?: string;
    search?: string;
    unSelect?: string[];
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
      //! Get Admin
      // NOT: {
      //   roles: {
      //     has: 'admin',
      //   },
      // },
    };

    const skip = (page - 1) * limit;
    const sortBy = { [sort]: order };

    const totalItems = await this.prisma.users.count({
      where: whereCondition,
    });
    const totalPages = Math.ceil(totalItems / limit);

    const users = await this.prisma.users.findMany({
      where: whereCondition,
      take: limit,
      skip,
      orderBy: sortBy,
      omit: getSelectData(unSelect),
    });

    return {
      users,
      current_page: page,
      total_pages: totalPages,
      total_items: totalItems,
    };
  }

  async checkUserExistsById(id: number) {
    const user = await this.findOne({ id });

    if (!user) throw new NotFoundException(`User with ID ${id} not found`);

    return user;
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
      unSelect: ['password', 'deleted_at'],
    });
  }

  async getById(id: number) {
    return await this.checkUserExistsById(id);
  }

  async update(id: number, payload: any) {
    await this.checkUserExistsById(id);

    return await this.prisma.users.update({
      where: { id },
      data: payload,
    });
  }

  async remove(id: number) {
    const user = await this.checkUserExistsById(id);

    if (user.deleted_at) throw new BadRequestException('User is deleted');

    await this.prisma.users.update({
      where: { id },
      data: {
        deleted_at: new Date(),
      },
    });

    return;
  }

  async restore(id: number) {
    const user = await this.checkUserExistsById(id);

    if (!user.deleted_at) throw new BadRequestException('User is not deleted');

    return await this.prisma.users.update({
      where: { id },
      data: {
        deleted_at: null,
      },
      omit: getSelectData([
        'password',
        'is_active',
        'code_id',
        'code_expired',
        'deleted_at',
      ]),
    });
  }

  async delete(id: number) {
    await this.checkUserExistsById(id);
    await this.prisma.users.delete({ where: { id } });
    return;
  }

  async handleActive(id: number): Promise<users | null> {
    return await this.prisma.users.update({
      where: { id },
      data: { is_active: true },
    });
  }

  async updateOne(id: number, payload: any): Promise<users | null> {
    return await this.prisma.users.update({
      where: { id },
      data: payload,
    });
  }
}
