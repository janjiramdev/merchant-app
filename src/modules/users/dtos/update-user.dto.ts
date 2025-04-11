import { IsNumber, IsOptional, IsString, Matches, Min } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
  password?: string;

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
