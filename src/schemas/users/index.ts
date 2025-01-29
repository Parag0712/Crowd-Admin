import { z } from "zod";

// Admin create schema
export const userCreateSchema = z.object({
  name: z.string().min(1, "First name is required"), // First name is required
  email: z.string().email("Invalid email address"), // Validate email format
  phoneNumber: z
    .string()
    .length(10, "Phone number must be 10 digits")
    .regex(/^\d{10}$/, "Phone number must be a valid 10-digit number"), // Validate phone number
  password: z.string().min(6, "Password must be at least 6 characters long"), // Validate password length
});

export const userEditSchema = z.object({
  name: z.string().min(1, "First name is required").optional(), // Optional First name
  email: z.string().email("Invalid email address").optional(), // Optional email
  phoneNumber: z
    .string()
    .length(10, "Phone number must be 10 digits")
    .regex(/^\d{10}$/, "Phone number must be a valid 10-digit number")
    .optional(),
  isActive: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
});
