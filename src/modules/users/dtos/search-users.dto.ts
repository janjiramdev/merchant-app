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
import { SortDto } from 'src/utils/sort.util';

export class SearchUsersDto extends SortDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  username?: string | Record<string, unknown>;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  firstName?: string | Record<string, unknown>;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  lastName?: string | Record<string, unknown>;

  @IsOptional()
  @IsEnum(EUserGender)
  gender?: EUserGender;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  age?: number;
}
