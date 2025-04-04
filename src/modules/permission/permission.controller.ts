import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { PermissionService } from './permission.service';
import { Roles } from '../../common/decorator/roles.decorator';
import { Role } from '../../common/enum/role.enum';
import { ResponseMessage } from '../../common/decorator/response_message.decorator';

@Controller('permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage('Created permission successfully')
  create(@Body('name') name: string) {
    return this.permissionService.create(name);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ResponseMessage('Get permission list successfully')
  findAll() {
    return this.permissionService.findAll();
  }

  @Roles(Role.ADMIN)
  @Get(':id')
  @ResponseMessage('Get permission successfully')
  findOne(@Param('id', ParseUUIDPipe) id) {
    return this.permissionService.findOne(id);
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  @ResponseMessage('Permission updated successfully')
  update(@Param('id', ParseUUIDPipe) id, @Body('name') name: string) {
    return this.permissionService.update(id, name);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  @ResponseMessage('Permission deleted from the database successfully')
  remove(@Param('id', ParseUUIDPipe) id) {
    return this.permissionService.remove(id);
  }
}
