import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RolesDocument = HydratedDocument<Role>;

@Schema({ collection: 'roles' })
export class Role {
  @Prop({ type: String, unique: true, required: true })
  name: string;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
