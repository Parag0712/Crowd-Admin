import { z } from "zod";

export const gateCreateSchema = z.object({
  location: z.string().min(1, "Location is required"),
  description: z.string().optional(),
  gateId: z.string().min(1, "Gate ID is required"),
});

export const gateUpdateSchema = z.object({
  gateId: z.string().min(1, "Gate ID is required"),
  location: z.string().min(1).optional(),
  description: z.string().optional(),
  isActive: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE").optional(),
});
