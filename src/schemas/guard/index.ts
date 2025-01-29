import { z } from "zod";

// Admin create schema
export const guardCreateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be 10 digits")
    .regex(/^\d{10}$/, "Phone number must be a valid 10-digit number"),
  employeeId: z.string().min(1, "Employee ID is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const guardEditSchema = z.object({
  name: z.string().min(1, "First name is required").optional(), // Optional First name
  email: z.string().email("Invalid email address").optional(), // Optional email
  phoneNumber: z
    .string()
    .min(10, "Phone number must be 10 digits")
    .regex(/^\d{10}$/, "Phone number must be a valid 10-digit number"),
  employeeId: z.string().min(1, "Employee ID is required"),

  isActive: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
});
