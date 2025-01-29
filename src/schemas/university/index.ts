import { z } from "zod";

// Admin create schema
export const universityCreateSchema = z.object({
  name: z.string().min(1, "Name is required"), // First name is required
  address: z.string().min(1, "Address is required"),
  phoneNumber: z
    .string()
    .length(10, "Phone number must be 10 digits")
    .regex(/^\d{10}$/, "Phone number must be a valid 10-digit number"),
});

export const universityEditSchema = z.object({
  name: z.string().min(1, "First name is required").optional(), // Optional First name
  address: z.string().min(1, "Address is required").optional(),
  phoneNumber: z
    .string()
    .length(10, "Phone number must be 10 digits")
    .regex(/^\d{10}$/, "Phone number must be a valid 10-digit number")
    .optional(),
  isActive: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
});

