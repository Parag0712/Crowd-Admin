import { z } from "zod";
// Admin create schema
export const principalCreateSchema = z.object({
  name: z.string().min(1, "Organization name is required"),
  email: z.string().email("Invalid email format"),
  phoneNumber: z
    .string()
    .trim()
    .length(10, "Phone number must be 10 digits")
    .regex(/^\d{10}$/, "Phone number must be a valid 10-digit number"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  orgId: z
    .string()
    .transform(Number)
    .refine((value) => !isNaN(value), {
      message: "Organization ID is required",
    }),
});

export const principalEditSchema = z.object({
  orgId: z
    .string()
    .transform(Number)
    .refine((value) => !isNaN(value), {
      message: "Organization ID is required",
    }),
  name: z.string().min(1).optional(),
  email: z.string().email("Invalid email format"),
  phoneNumber: z
    .string()
    .trim()
    .length(10, "Phone number must be 10 digits")
    .regex(/^\d{10}$/, "Phone number must be a valid 10-digit number"),
  isActive: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE").optional(),
});
