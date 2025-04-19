import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { EUserGender } from 'src/enums/users.enum';

export class SearchUsersDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  username?: string | Record<string, unknown>;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  firstname?: string | Record<string, unknown>;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  lastname?: string | Record<string, unknown>;

  @IsOptional()
  @IsEnum(EUserGender)
  gender?: EUserGender;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  age?: number;
}
