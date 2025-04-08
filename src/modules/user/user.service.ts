import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationDTO } from '../../common/dto/pagination.dto';
import { getSelectData } from '../../util';
import aqp from 'api-query-params';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string): Promise<any> {
    return await this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string): Promise<any> {
    return await this.prisma.user.findUnique({
      where: { id },
      include: { roles: { include: { role: true } } },
      omit: getSelectData(['password', 'is_active', 'code_id', 'code_expired']),
    });
  }

  async findOne(id: string): Promise<any> {
    return await this.prisma.user.findUnique({
      where: { id },
      omit: getSelectData([
        'password',
        'is_active',
        'code_id',
        'code_expired',
        'deleted_at',
      ]),
    });
  }

  async checkUserIdExists(id: string) {
    const user = await this.findById(id);

    if (!user) throw new NotFoundException(`User not found`);

    return;
  }

  async findByEmailAndCode(email: string, code: string): Promise<any> {
    return await this.prisma.user.findUnique({
      where: { email, code_id: code },
    });
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

    const totalItems = await this.prisma.user.count({
      where: whereCondition,
    });
    const totalPages = Math.ceil(totalItems / limit);

    const users = await this.prisma.user.findMany({
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

  async create(payload: any) {
    return await this.prisma.user.create({
      data: { ...payload },
    });
  }

  async getAll(query: string, paginationDTO: PaginationDTO): Promise<any> {
    return await this.findAllNotAdmin({
      query,
      ...paginationDTO,
      unSelect: ['password', 'deleted_at'],
    });
  }

  async getById(id: string) {
    const user = await this.findById(id);

    if (!user) throw new NotFoundException(`User not found`);

    return user;
  }

  async update(id: string, payload: any) {
    await this.checkUserIdExists(id);

    const updated = await this.prisma.user.update({
      where: { id },
      data: payload,
      include: {
        roles: {
          include: {
            role: { select: { id: true, name: true } },
          },
        },
      },
      omit: getSelectData([
        'password',
        'is_active',
        'code_id',
        'code_expired',
        'deleted_at',
      ]),
    });

    return {
      ...updated,
      roles: updated.roles.map((ur) => ur.role),
    };
  }

  async softDelete(id: string) {
    const user = await this.getById(id);

    if (user.deleted_at) throw new BadRequestException('User is deleted');

    await this.prisma.user.update({
      where: { id },
      data: {
        deleted_at: new Date(),
      },
    });

    return;
  }

  async restore(id: string) {
    const user = await this.getById(id);

    if (!user.deleted_at) throw new BadRequestException('User is not deleted');

    return await this.prisma.user.update({
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

  async hardDelete(id: string) {
    await this.checkUserIdExists(id);
    await this.prisma.user.delete({ where: { id } });
    return;
  }

  async handleActive(id: string): Promise<any> {
    return await this.prisma.user.update({
      where: { id },
      data: { is_active: true },
    });
  }

  async updateOne(id: string, payload: any): Promise<any> {
    return await this.prisma.user.update({
      where: { id },
      data: payload,
    });
  }
}
