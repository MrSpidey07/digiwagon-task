import { z } from "zod";

// Auth Schemas
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  role: z.enum(["admin", "user"]).optional(),
});

// Product Schemas
const variantSchema = z.object({
  name: z.string().min(1, "Variant name is required"),
  amount: z.number().positive("Amount must be a positive number"),
});

export const createProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().optional(),
  variants: z.array(variantSchema).min(1, "At least one variant is required"),
});

export const updateProductSchema = z.object({
  name: z.string().min(1, "Product name is required").optional(),
  description: z.string().optional(),
  variants: z.array(variantSchema).optional(),
});
