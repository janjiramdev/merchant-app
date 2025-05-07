import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { EStockAdjustType } from 'src/enums/stock-adjustment.enum';
import { User } from './user.schema';
import { Product } from './product.schema';

@Schema({ collection: 'stockAdjustment' })
export class StockAdjustment {
  @Prop({
    type: Types.ObjectId,
    unique: false,
    required: true,
    nullable: false,
    ref: 'Product',
  })
  product: Product;

  @Prop({
    type: String,
    enum: EStockAdjustType,
    unique: false,
    required: true,
    nullable: false,
  })
  adjustType: EStockAdjustType;

  @Prop({ type: Number, unique: false, required: true, nullable: false })
  quantity: number;

  // ----- ----- ----- Action User ----- ----- ----- //

  @Prop({
    type: Types.ObjectId,
    unique: false,
    required: true,
    nullable: false,
    ref: 'User',
  })
  createdBy: User;

  // ----- ----- ----- Timestamp ----- ----- ----- //

  @Prop({
    type: Date,
    unique: false,
    required: true,
    nullable: false,
  })
  createdAt: Date;
}

export type StockAdjustmentDocument = HydratedDocument<StockAdjustment>;
export const StockAdjustmentSchema =
  SchemaFactory.createForClass(StockAdjustment);
