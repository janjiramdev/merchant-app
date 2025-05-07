import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class SaleDto {
  @IsNotEmpty()
  @IsString()
  productId: string;

  @IsNumber()
  @Min(1)
  quantity: number;
}
