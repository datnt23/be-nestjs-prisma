import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ResponseMessage } from '../../common/decorator/response_message.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
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
  @ResponseMessage('Get user successfully')
  async findOne(@Param('id', ParseUUIDPipe) id) {
    return this.userService.getById(id);
  }

  @Patch(':id')
  @ResponseMessage('User updated successfully')
  async update(@Param('id', ParseUUIDPipe) id, @Body() payload: any) {
    return this.userService.update(id, payload);
  }

  @Delete(':id/soft')
  @ResponseMessage('User deleted successfully')
  async softDelete(@Param('id', ParseUUIDPipe) id) {
    return this.userService.softDelete(id);
  }

  @Post(':id/restore')
  @ResponseMessage('User restored successfully')
  async restore(@Param('id', ParseUUIDPipe) id) {
    return this.userService.restore(id);
  }

  @Delete(':id')
  @ResponseMessage('User deleted from the database successfully')
  async hardDelete(@Param('id', ParseUUIDPipe) id) {
    return this.userService.hardDelete(id);
  }
}
