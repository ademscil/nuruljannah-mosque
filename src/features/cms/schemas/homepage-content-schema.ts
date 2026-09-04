import { z } from "zod";

export const homepageContentSchema = z.object({
  heroTitle: z.string().min(3, "Judul hero minimal 3 karakter."),
  heroSubtitle: z.string().min(5, "Subtitle hero minimal 5 karakter."),
  heroPrimaryCtaLabel: z.string().min(2, "Label CTA minimal 2 karakter."),
  heroPrimaryCtaHref: z
    .string()
    .min(1, "Link CTA wajib diisi.")
    .refine((value) => value.startsWith("/") || value.startsWith("http"), "Link CTA harus berupa path internal (contoh: /agenda-kegiatan) atau URL valid."),
  welcomeTitle: z.string().min(3, "Judul sambutan minimal 3 karakter."),
  welcomeContent: z.string().min(10, "Isi sambutan minimal 10 karakter."),
  donationCtaTitle: z.string().min(3, "Judul CTA donasi minimal 3 karakter."),
  donationCtaDescription: z
    .string()
    .min(10, "Deskripsi CTA donasi minimal 10 karakter."),
  featuredAnnouncementId: z.string().optional(),
  featuredEventId: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("PUBLISHED"),
});

export type HomepageContentSchema = z.infer<typeof homepageContentSchema>;
