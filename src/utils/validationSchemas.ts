// src/utils/validationSchemas.ts

import { z } from "zod";
const singleProductBodySchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters long'),
  description: z.string().min(10, 'Description must be at least 10 characters long'),
  price: z.number().positive('Price must be a positive number'),
  category: z.string().min(1, 'Category is required'),
  stock: z.number().int().nonnegative('Stock must be a non-negative integer'),
  images: z.array(z.string().url('Each image must be a valid URL')).optional(),
});

export const createProductSchema = z.object({
  body: singleProductBodySchema,
});

export const createBulkProductsSchema = z.object({
  body: z.array(singleProductBodySchema),
});



export const updateProductSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(3, "Name must be at least 3 characters long")
      .optional(),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters long")
      .optional(),
    price: z.number().positive("Price must be a positive number").optional(),
    category: z.string().min(1, "Category is required").optional(),
    stock: z
      .number()
      .int()
      .nonnegative("Stock must be a non-negative integer")
      .optional(),
    images: z
      .array(z.string().url("Each image must be a valid URL"))
      .optional(),
  }),
});
