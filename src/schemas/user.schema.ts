import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = Document<User>;

@Schema({ collection: 'users' })
export class User {
  @Prop({ type: String, unique: false, required: true, nullable: false })
  username: string;

  @Prop({
    type: String,
    unique: false,
    required: true,
    nullable: false,
    select: false,
  })
  password: string;

  @Prop({ type: String, unique: false, required: true, nullable: false })
  firstname: string;

  @Prop({ type: String, unique: false, required: true, nullable: false })
  lastname: string;

  @Prop({ type: Number, unique: false, required: true, nullable: false })
  age: number;

  @Prop({
    type: Types.ObjectId,
    unique: false,
    required: true,
    nullable: false,
    ref: 'Role',
  })
  role: number;

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

export const UserSchema = SchemaFactory.createForClass(User);
export type UserWithId = User & {
  _id: Types.ObjectId;
};
