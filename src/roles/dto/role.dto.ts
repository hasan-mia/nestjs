import { IsOptional, IsString } from 'class-validator';

export class RoleDto {
  @IsString()
  public role_name: string;

  @IsOptional()
  @IsString()
  public description?: string;
}
