import { IsEnum, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { EStockAdjustType } from 'src/enums/stock-adjustment.enum';

export class AdjustStockDto {
  @IsNotEmpty()
  @IsString()
  productId: string;

  @IsEnum(EStockAdjustType)
  adjustType: EStockAdjustType;

  @IsNumber()
  @Min(0)
  quantity: number;
}
