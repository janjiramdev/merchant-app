import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class SearchProductDto {
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
