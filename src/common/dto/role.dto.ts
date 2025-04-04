import { IsArray, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class UpdateUserRoleDto {
  @IsUUID()
  @IsNotEmpty()
  user_id: string;

  @IsArray()
  @IsUUID(undefined, { each: true })
  roles: string[];
}

export class AssignPermissionToRoleDto {
  @IsArray({ message: 'permissionIds must be an array' })
  @IsNotEmpty({ message: 'permissionIds cannot be empty' })
  @IsString({ each: true, message: 'Each permissionId must be a string' })
  @IsUUID('4', {
    each: true,
    message: 'Each permissionId must be a valid UUID',
  })
  permission_ids: string[];
}
