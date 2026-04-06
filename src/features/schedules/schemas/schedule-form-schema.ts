import { z } from "zod";

export const scheduleFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, "Judul jadwal minimal 3 karakter."),
  roleType: z.enum(["IMAM", "MUADZIN", "KHATIB", "PETUGAS_KEGIATAN"]),
  scheduleFor: z.string().min(1, "Tanggal jadwal wajib diisi."),
  timeLabel: z.string().min(3, "Jam/tanda waktu wajib diisi."),
  personName: z.string().min(3, "Nama petugas wajib diisi."),
  notes: z.string().optional(),
});

export type ScheduleFormSchema = z.infer<typeof scheduleFormSchema>;
