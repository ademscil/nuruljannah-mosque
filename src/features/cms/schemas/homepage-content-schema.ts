import { z } from "zod";

export const homepageContentSchema = z.object({
  heroTitle: z.string().min(10, "Judul hero minimal 10 karakter."),
  heroSubtitle: z.string().min(20, "Subtitle hero minimal 20 karakter."),
  heroPrimaryCtaLabel: z.string().min(3, "Label CTA minimal 3 karakter."),
  heroPrimaryCtaHref: z.string().min(1, "Link CTA wajib diisi."),
  welcomeTitle: z.string().min(5, "Judul sambutan minimal 5 karakter."),
  welcomeContent: z.string().min(20, "Isi sambutan minimal 20 karakter."),
  donationCtaTitle: z.string().min(5, "Judul CTA donasi minimal 5 karakter."),
  donationCtaDescription: z
    .string()
    .min(20, "Deskripsi CTA donasi minimal 20 karakter."),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
});

export type HomepageContentSchema = z.infer<typeof homepageContentSchema>;
