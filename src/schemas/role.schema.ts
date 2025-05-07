// Hold

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ collection: 'roles' })
export class Role {
  @Prop({ type: String, unique: false, required: true, nullable: false })
  name: string;

  @Prop({
    type: Number,
    unique: false,
    required: true,
    nullable: false,
  })
  userCount: number;

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

export type RolesDocument = HydratedDocument<Role>;
export const RoleSchema = SchemaFactory.createForClass(Role);
