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
import { ResponseMessage } from '../../decorator/response_message.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Get user list successfully')
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

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Get user successfully')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getById(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('User updated successfully')
  async update(@Param('id', ParseIntPipe) id: number, @Body() payload: any) {
    return this.userService.update(id, payload);
  }

  @Delete(':id/remove')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('User deleted successfully')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }

  @HttpCode(HttpStatus.OK)
  @Post(':id/restore')
  @ResponseMessage('User restored successfully')
  async restore(@Param('id', ParseIntPipe) id: number) {
    return this.userService.restore(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('User deleted from the database successfully')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.userService.delete(id);
  }
}
