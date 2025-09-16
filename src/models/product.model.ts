import mongoose, { Schema, Document } from "mongoose";

// Interface to define the properties of a Product
export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images: string[];
  createdAt: Date;
}

const ProductSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, index: true },
    stock: { type: Number, required: true, min: 0 },
    images: [{ type: String }], // Array of image URLs
  },
  { timestamps: true }
); // Automatically adds createdAt and updatedAt fields

// Export the model
export default mongoose.model<IProduct>("Product", ProductSchema);
