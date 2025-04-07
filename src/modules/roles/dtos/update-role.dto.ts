import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateRoleDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name: string;
}
