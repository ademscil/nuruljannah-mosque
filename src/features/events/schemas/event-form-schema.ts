import { z } from "zod";

export const eventFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(5, "Nama kegiatan minimal 5 karakter."),
  slug: z.string().min(3, "Slug minimal 3 karakter."),
  description: z.string().min(20, "Deskripsi minimal 20 karakter."),
  date: z.string().min(1, "Tanggal kegiatan wajib diisi."),
  timeLabel: z.string().min(3, "Waktu kegiatan wajib diisi."),
  location: z.string().min(3, "Lokasi wajib diisi."),
  personInCharge: z.string().min(3, "Penanggung jawab wajib diisi."),
  status: z.enum(["DRAFT", "PUBLISHED", "COMPLETED", "CANCELLED"]),
  isPublic: z.boolean(),
  isFeatured: z.boolean(),
  posterUrl: z.string().url("Poster harus berupa URL valid.").or(z.literal("")),
});

export type EventFormSchema = z.infer<typeof eventFormSchema>;
