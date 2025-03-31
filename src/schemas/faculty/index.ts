import { z } from "zod";
// Admin create schema
export const facultyCreateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  phoneNumber: z
    .string()
    .trim()
    .length(10, "Phone number must be 10 digits")
    .regex(/^\d{10}$/, "Phone number must be a valid 10-digit number"),
  employeeId: z.string().min(1, "Employee ID is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  branchId: z
    .string()
    .transform(Number)
    .refine((value) => !isNaN(value), {
      message: "Branch ID is required",
    }),
});

export const facultyEditSchema = z.object({
  branchId: z
    .string()
    .transform(Number)
    .refine((value) => !isNaN(value), {
      message: "Branch ID is required",
    }),
  name: z.string().min(1).optional(),
  email: z.string().email("Invalid email format"),
  employeeId: z.string().min(1, "Employee ID is required"),
  phoneNumber: z
    .string()
    .trim()
    .length(10, "Phone number must be 10 digits")
    .regex(/^\d{10}$/, "Phone number must be a valid 10-digit number"),
  isActive: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE").optional(),
});
