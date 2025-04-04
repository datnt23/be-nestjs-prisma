import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { Roles } from '../../common/decorator/roles.decorator';
import { Role } from '../../common/enum/role.enum';
import { ResponseMessage } from '../../common/decorator/response_message.decorator';
import { AssignPermissionToRoleDto } from 'src/common/dto/role.dto';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}
  @Post()
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage('Created role successfully')
  create(@Body('name') name: string) {
    return this.roleService.create(name);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ResponseMessage('Get role list successfully')
  findAll() {
    return this.roleService.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  @ResponseMessage('Get role successfully')
  findOne(@Param('id', ParseUUIDPipe) id) {
    return this.roleService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ResponseMessage('Role updated successfully')
  update(@Param('id', ParseUUIDPipe) id, @Body('name') name: string) {
    return this.roleService.update(id, name);
  }

  @Post(':id/permission')
  @Roles(Role.ADMIN)
  @ResponseMessage('Permissions assigned successfully')
  assignPermissionToRole(
    @Param('id', ParseUUIDPipe) id,
    @Body() body: AssignPermissionToRoleDto,
  ) {
    return this.roleService.assignPermissionToRole(id, body.permission_ids);
  }

  @Post('user/:user_id')
  @Roles(Role.ADMIN)
  @ResponseMessage('Role assigned to user successfully')
  assignRoleToUser(
    @Param('user_id', ParseUUIDPipe) userId,
    @Body('role_id') roleId: string,
  ) {
    return this.roleService.assignRoleToUser(userId, roleId);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ResponseMessage('Role deleted from the database successfully')
  remove(@Param('id', ParseUUIDPipe) id) {
    return this.roleService.remove(id);
  }
}
