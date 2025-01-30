import { z } from "zod";
// Admin create schema
export const organizationCreateSchema = z.object({
  name: z.string().min(1, "Organization name is required"),
  description: z.string().optional(),
});

export const organizationEditSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  isActive: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE").optional(),
});
