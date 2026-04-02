import { z } from "zod";

export const eventFilterSchema = z.object({
  query: z.string().optional(),
  status: z
    .enum(["ALL", "DRAFT", "PUBLISHED", "COMPLETED", "CANCELLED"])
    .default("ALL"),
  visibility: z.enum(["ALL", "PUBLIC", "INTERNAL"]).default("ALL"),
});

export type EventFilterSchema = z.infer<typeof eventFilterSchema>;
