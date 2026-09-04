import { z } from "zod";

const isValidDateString = (value: string) => !Number.isNaN(new Date(value).getTime());

export const galleryFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, "Judul minimal 3 karakter."),
  category: z.string().min(3, "Kategori minimal 3 karakter."),
  imageUrl: z.string().refine(
    (val) => Boolean(val && (val.startsWith("http://") || val.startsWith("https://") || val.startsWith("data:image/") || val.startsWith("/"))),
    "Foto harus berupa URL atau berkas gambar valid.",
  ),
  activityDate: z
    .string()
    .min(1, "Tanggal kegiatan wajib diisi.")
    .refine(isValidDateString, "Tanggal kegiatan tidak valid."),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
});

export type GalleryFormSchema = z.infer<typeof galleryFormSchema>;
