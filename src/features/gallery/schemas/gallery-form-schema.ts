import { z } from "zod";

export const galleryFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, "Judul minimal 3 karakter."),
  category: z.string().min(3, "Kategori minimal 3 karakter."),
  imageUrl: z.string().url("Foto harus berupa URL valid."),
  activityDate: z.string().min(1, "Tanggal kegiatan wajib diisi."),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
});

export type GalleryFormSchema = z.infer<typeof galleryFormSchema>;
