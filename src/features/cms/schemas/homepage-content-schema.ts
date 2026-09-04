import { z } from "zod";

export const homepageContentSchema = z.object({
  heroTitle: z
    .string()
    .optional()
    .transform((v) => (v && v.trim().length > 0 ? v : "Masjid Nurul Jannah"))
    .pipe(z.string().min(3, "Judul hero minimal 3 karakter.")),
  heroSubtitle: z
    .string()
    .optional()
    .transform((v) =>
      v && v.trim().length > 0
        ? v
        : "Pusat Ibadah, Pembinaan Umat, dan Kebersamaan Jamaah",
    )
    .pipe(z.string().min(5, "Subtitle hero minimal 5 karakter.")),
  heroPrimaryCtaLabel: z
    .string()
    .optional()
    .transform((v) => (v && v.trim().length > 0 ? v : "Lihat Agenda"))
    .pipe(z.string().min(2, "Label CTA minimal 2 karakter.")),
  heroPrimaryCtaHref: z
    .string()
    .optional()
    .transform((v) => (v && v.trim().length > 0 ? v : "/agenda-kegiatan"))
    .pipe(
      z
        .string()
        .min(1, "Link CTA wajib diisi.")
        .refine(
          (value) => value.startsWith("/") || value.startsWith("http"),
          "Link CTA harus berupa path internal (contoh: /agenda-kegiatan) atau URL valid.",
        ),
    ),
  welcomeTitle: z
    .string()
    .optional()
    .transform((v) => (v && v.trim().length > 0 ? v : "Sambutan Ketua DKM"))
    .pipe(z.string().min(3, "Judul sambutan minimal 3 karakter.")),
  welcomeContent: z
    .string()
    .optional()
    .transform((v) =>
      v && v.trim().length > 0
        ? v
        : "Selamat datang di website resmi Masjid Nurul Jannah. Mari kita makmurkan masjid bersama-sama.",
    )
    .pipe(z.string().min(10, "Isi sambutan minimal 10 karakter.")),
  donationCtaTitle: z
    .string()
    .optional()
    .transform((v) => (v && v.trim().length > 0 ? v : "Mari Berinfaq & Bersedekah"))
    .pipe(z.string().min(3, "Judul CTA donasi minimal 3 karakter.")),
  donationCtaDescription: z
    .string()
    .optional()
    .transform((v) =>
      v && v.trim().length > 0
        ? v
        : "Salurkan donasi terbaik Anda untuk kemakmuran masjid dan pembinaan umat.",
    )
    .pipe(z.string().min(10, "Deskripsi CTA donasi minimal 10 karakter.")),
  featuredAnnouncementId: z.string().optional(),
  featuredEventId: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("PUBLISHED"),
});

export type HomepageContentSchema = z.infer<typeof homepageContentSchema>;
