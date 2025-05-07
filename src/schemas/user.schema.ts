import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { EUserGender } from 'src/enums/users.enum';

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
  firstName: string;

  @Prop({ type: String, unique: false, required: true, nullable: false })
  lastName: string;

  @Prop({
    type: String,
    enum: EUserGender,
    unique: false,
    required: true,
    nullable: false,
  })
  gender: EUserGender;

  @Prop({ type: Number, unique: false, required: true, nullable: false })
  age: number;

  @Prop({
    type: String,
    unique: false,
    required: false,
    nullable: true,
    select: false,
  })
  refreshToken?: string;

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

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
