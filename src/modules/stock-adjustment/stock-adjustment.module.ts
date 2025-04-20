import { Module } from '@nestjs/common';
import { StockAdjustmentService } from './stock-adjustment.service';
import {
  StockAdjustment,
  StockAdjustmentSchema,
} from 'src/schemas/stock-adjustment.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { StockAdjustmentController } from './stock-adjustment.controller';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: StockAdjustment.name, schema: StockAdjustmentSchema },
    ]),
    ProductsModule,
  ],
  controllers: [StockAdjustmentController],
  providers: [StockAdjustmentService],
})
export class StockAdjustmentModule {}
