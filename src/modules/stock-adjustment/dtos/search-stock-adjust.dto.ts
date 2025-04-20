import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { EStockAdjustType } from 'src/enums/stock-adjustment.enum';

export class SearchStockAdjustDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  productId?: string;

  @IsOptional()
  @IsEnum(EStockAdjustType)
  adjustType?: EStockAdjustType;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  quantity?: number;
}
