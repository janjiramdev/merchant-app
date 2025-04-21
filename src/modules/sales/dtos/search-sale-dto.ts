import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class SearchSaleDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  productId?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  quantity?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  totalPrice?: number;
}
