import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(
    @Query() query: string,
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('sort') sort: string,
    @Query('order') order: string,
  ) {
    return await this.userService.getAll(query, {
      page,
      limit,
      sort,
      order,
    });
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getById(id);
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
    return this.userService.update(id, data);
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':id/remove')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.deleteAt(id);
  }

  @HttpCode(HttpStatus.OK)
  @Post(':id/restore')
  async restore(@Param('id', ParseIntPipe) id: number) {
    return this.userService.restore(id);
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.userService.delete(id);
  }
}
