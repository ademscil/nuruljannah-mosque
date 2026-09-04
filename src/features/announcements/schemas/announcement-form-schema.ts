import { z } from "zod";

const isValidDateString = (value: string) => !Number.isNaN(new Date(value).getTime());

export const announcementFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(5, "Judul minimal 5 karakter."),
  slug: z.string().min(3, "Slug minimal 3 karakter."),
  content: z.string().min(20, "Isi pengumuman minimal 20 karakter."),
  category: z.string().min(3, "Kategori minimal 3 karakter."),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  publishedAt: z
    .string()
    .optional()
    .refine((value) => !value || isValidDateString(value), "Tanggal publish tidak valid."),
  thumbnailUrl: z.string().refine(
    (val) => !val || val.startsWith("http://") || val.startsWith("https://") || val.startsWith("data:image/") || val.startsWith("/"),
    "Thumbnail harus berupa URL atau berkas gambar valid.",
  ).optional().or(z.literal("")),
});

export type AnnouncementFormSchema = z.infer<typeof announcementFormSchema>;
