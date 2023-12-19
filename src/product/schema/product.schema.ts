import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema()
export class Product {
  @Prop()
  name: string;
  @Prop()
  price: number;
  @Prop()
  description: string;
  @Prop()
  material: string[];
  @Prop()
  category: string;
  @Prop()
  subCategory: string;
  @Prop()
  color: string[];
  @Prop()
  size: string[];
  @Prop()
  stock: string[];
  @Prop()
  supplier: string;
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
}

export const ProductSchema = SchemaFactory.createForClass(Product);
