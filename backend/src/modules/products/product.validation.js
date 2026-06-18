import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(2, 'Product name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().positive('Price must be greater than 0'),
  sizes: z.array(z.string()).min(1, 'At least one size is required'),
  stock: z.number().int().min(0, 'Stock cannot be negative'),
  category: z.string().min(1, 'Category is required'),
  collection: z.string().optional(),
});

export const updateProductSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().min(10).optional(),
  price: z.number().positive().optional(),
  sizes: z.array(z.string()).optional(),
  stock: z.number().int().min(0).optional(),
  category: z.string().optional(),
  collection: z.string().optional(),
  isAvailable: z.boolean().optional(),
});