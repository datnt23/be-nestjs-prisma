import { IsArray, IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateRolePermissionDto {
  @IsUUID()
  @IsNotEmpty()
  role_id: string;

  @IsArray()
  @IsUUID(undefined, { each: true })
  permissions: string[];
}
