import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Sales, SalesSchema } from 'src/schemas/sales.schema';
import { SalesController } from './sales.controller';
import { SalesService } from './sales.service';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Sales.name, schema: SalesSchema }]),
    ProductsModule,
  ],
  controllers: [SalesController],
  providers: [SalesService],
  exports: [SalesService],
})
export class SalesModule {}
