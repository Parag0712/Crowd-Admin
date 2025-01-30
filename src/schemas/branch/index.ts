import { z } from "zod";

export const branchCreateSchema = z.object({
  name: z.string().min(1, "Branch name is required"),
  description: z.string().optional(),
});

export const branchUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  isActive: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE").optional(),
});
