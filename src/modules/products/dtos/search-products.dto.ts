import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { SortDto } from 'src/utils/sort.util';

export class SearchProductDto extends SortDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name?: string | Record<string, unknown>;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  description?: string | Record<string, unknown>;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  currentStock?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  price?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  totalSales?: number;
}
