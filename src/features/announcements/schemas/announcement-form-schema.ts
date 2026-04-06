import { z } from "zod";

export const announcementFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(5, "Judul minimal 5 karakter."),
  slug: z.string().min(3, "Slug minimal 3 karakter."),
  content: z.string().min(20, "Isi pengumuman minimal 20 karakter."),
  category: z.string().min(3, "Kategori minimal 3 karakter."),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  publishedAt: z.string().optional(),
  thumbnailUrl: z.string().url("Thumbnail harus berupa URL valid.").or(z.literal("")),
});

export type AnnouncementFormSchema = z.infer<typeof announcementFormSchema>;
