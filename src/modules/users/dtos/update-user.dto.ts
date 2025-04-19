import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Min,
} from 'class-validator';
import { EUserGender } from 'src/enums/users.enum';

export class UpdateUserDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
  password?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  firstname?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  lastname?: string;

  @IsOptional()
  @IsEnum(EUserGender)
  gender?: EUserGender;

  @IsOptional()
  @IsNumber()
  @Min(1)
  age?: number;
}
