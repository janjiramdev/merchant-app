import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from './user.schema';

@Schema({ collection: 'products' })
export class Product {
  @Prop({ type: String, unique: false, required: true, nullable: false })
  name: string;

  @Prop({
    type: String,
    unique: false,
    required: false,
    nullable: false,
  })
  description: string;

  @Prop({ type: Number, unique: false, required: true, nullable: false })
  currentStock: number;

  @Prop({ type: Number, unique: false, required: true, nullable: false })
  price: number;

  @Prop({ type: Number, unique: false, required: true, nullable: false })
  totalSales: number;

  // ----- ----- ----- Action User ----- ----- ----- //

  @Prop({
    type: Types.ObjectId,
    unique: false,
    required: true,
    nullable: false,
    ref: 'User',
  })
  createdBy: User;

  @Prop({
    type: Types.ObjectId,
    unique: false,
    required: true,
    nullable: false,
    ref: 'User',
  })
  updatedBy: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    unique: false,
    required: false,
    nullable: true,
    ref: 'User',
  })
  deletedBy: User;

  // ----- ----- ----- Timestamp ----- ----- ----- //

  @Prop({
    type: Date,
    unique: false,
    required: true,
    nullable: false,
  })
  createdAt: Date;

  @Prop({
    type: Date,
    unique: false,
    required: true,
    nullable: false,
  })
  updatedAt: Date;

  @Prop({
    type: Date,
    unique: false,
    required: false,
    nullable: true,
  })
  deletedAt: Date;
}

export type ProductDocument = HydratedDocument<Product>;
export const ProductSchema = SchemaFactory.createForClass(Product);
