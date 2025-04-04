import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RolesDocument = HydratedDocument<Role>;

@Schema({ collection: 'roles' })
export class Role {
  @Prop({ type: String, unique: true, required: true, nullable: false })
  name: string;

  @Prop({
    type: Number,
    unique: false,
    required: true,
    nullable: false,
  })
  userCount: Date;

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
    required: true,
    nullable: true,
  })
  deletedAt: Date;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
