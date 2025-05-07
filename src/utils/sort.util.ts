import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ESortDirectionDto } from 'src/enums/utils.enum';

export class SortDto {
  @IsNotEmpty()
  @IsString()
  sortBy: string;

  @IsNotEmpty()
  @IsEnum(ESortDirectionDto)
  sortDirection: ESortDirectionDto;
}
