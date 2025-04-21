import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Product } from './product.schema';
import { User } from './user.schema';

@Schema({ collection: 'sales' })
export class Sales {
  @Prop({
    type: Types.ObjectId,
    unique: false,
    required: true,
    nullable: false,
    ref: 'Product',
  })
  productId: Product;

  @Prop({ type: Number, unique: false, required: true, nullable: false })
  quantity: number;

  @Prop({ type: Number, unique: false, required: true, nullable: false })
  totalPrice: number;

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

export type SalesDocument = HydratedDocument<Sales>;
export const SalesSchema = SchemaFactory.createForClass(Sales);
