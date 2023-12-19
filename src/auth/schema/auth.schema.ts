import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  firstname: string;
  @Prop()
  lastname: string;

  @Prop({ immutable: true })
  username: string;

  @Prop()
  password: string;

  @Prop()
  companyName: string;

  @Prop({
    type: {
      key: { type: String },
      location: { type: String },
    },
  })
  image: {
    key: string;
    location: string;
  };

  @Prop()
  phone: string;

  @Prop()
  address: string;

  @Prop()
  listProducts: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
