import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class SearchUsersDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  firstname?: string;

  @IsOptional()
  @IsString()
  lastname?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  age?: number;

  @IsOptional()
  @IsString()
  role?: string;
}
