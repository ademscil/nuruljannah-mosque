import { z } from "zod";

export const announcementFilterSchema = z.object({
  query: z.string().optional(),
  status: z.enum(["ALL", "DRAFT", "PUBLISHED", "ARCHIVED"]).default("ALL"),
});

export type AnnouncementFilterSchema = z.infer<
  typeof announcementFilterSchema
>;
