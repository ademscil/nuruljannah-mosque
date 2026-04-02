import { z } from "zod";

export const scheduleFilterSchema = z.object({
  query: z.string().optional(),
  roleType: z
    .enum(["ALL", "IMAM", "MUADZIN", "KHATIB", "PETUGAS_KEGIATAN"])
    .default("ALL"),
});

export type ScheduleFilterSchema = z.infer<typeof scheduleFilterSchema>;
