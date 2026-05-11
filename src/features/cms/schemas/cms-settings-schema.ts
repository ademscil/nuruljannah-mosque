import { z } from "zod";

const navItemSchema = z.object({
  label: z.string().min(2, "Label menu minimal 2 karakter."),
  href: z.string().min(1, "Link menu wajib diisi.").refine((v) => v.startsWith("/"), "Link menu harus path internal, contoh: /profil-masjid."),
});

const quickLinkSchema = z.object({
  title: z.string().min(3, "Judul link cepat minimal 3 karakter."),
  description: z.string().min(8, "Deskripsi link cepat minimal 8 karakter."),
  href: z.string().min(1, "Link cepat wajib diisi.").refine((v) => v.startsWith("/"), "Link cepat harus path internal, contoh: /agenda-kegiatan."),
});

const simpleListItem = z.object({
  title: z.string().min(2),
  description: z.string().min(5),
});

const statItem = z.object({
  label: z.string().min(2),
  value: z.string().min(1),
});

const pageCopySchema = z.object({
  agendaTitle: z.string().min(3),
  agendaDescription: z.string().min(8),
  pengumumanTitle: z.string().min(3),
  pengumumanDescription: z.string().min(8),
  donasiTitle: z.string().min(3),
  donasiDescription: z.string().min(8),
  donasiRecentTitle: z.string().min(3),
  donasiRecentDescription: z.string().min(8),
  galeriTitle: z.string().min(3),
  galeriDescription: z.string().min(8),
  jadwalTitle: z.string().min(3),
  jadwalDescription: z.string().min(8),
  keuanganTitle: z.string().min(3),
  keuanganDescription: z.string().min(8),
});

const contentBlocksSchema = z.object({
  heroVideoUrl: z
    .string()
    .url("URL video hero tidak valid.")
    .refine(
      (value) => {
        const normalized = value.toLowerCase();
        return normalized.includes(".mp4") || normalized.includes(".webm");
      },
      "URL video hero harus format .mp4 atau .webm.",
    ),
  heroBadge: z.string().min(3),
  heroEyebrow: z.string().min(3),
  heroSecondaryButtonLabel: z.string().min(3),
  stats: z.array(statItem).min(1),
  features: z.array(simpleListItem).min(1),
  services: z.array(simpleListItem).min(1),
  quickLinksSectionTitle: z.string().min(3),
  quickLinksSectionBadge: z.string().min(3),
  ctaBadge: z.string().min(3),
  ctaPrimaryButtonLabel: z.string().min(3),
  ctaSecondaryButtonLabel: z.string().min(3),
  profileAboutTitle: z.string().min(3),
  profileAboutHeading: z.string().min(3),
  profileAboutContent: z.string().min(8),
  profileVisionTitle: z.string().min(3),
  profileVisionContent: z.string().min(8),
  profileMissionTitle: z.string().min(3),
  profileMissionContent: z.string().min(8),
  profileFacilitiesHeading: z.string().min(3),
  profileManagementBadge: z.string().min(3),
  profileManagementHeading: z.string().min(3),
  contactIntroBadge: z.string().min(3),
  contactIntroTitle: z.string().min(3),
  contactIntroDescription: z.string().min(8),
  contactMapButtonLabel: z.string().min(3),
  pageCopy: pageCopySchema,
});

export const cmsSettingsSchema = z.object({
  siteName: z.string().min(3),
  siteShortName: z.string().min(3),
  siteTagline: z.string().min(3),
  contactAddress: z.string().min(8),
  contactCity: z.string().min(3),
  contactEmail: z.string().email("Email tidak valid."),
  contactPhone: z.string().min(8),
  contactMapUrl: z.string().url("URL Google Maps tidak valid."),
  homeFeatureTitle: z.string().min(5),
  homeFeatureDescription: z.string().min(10),
  homeServiceTitle: z.string().min(5),
  homeServiceDescription: z.string().min(10),
  homeCtaTitle: z.string().min(5),
  homeCtaDescription: z.string().min(10),
  profileTitle: z.string().min(5),
  profileDescription: z.string().min(10),
  profileSidebarTitle: z.string().min(3),
  profileSidebarDescription: z.string().min(10),
  profileSidebarItems: z.array(z.string().min(3)).min(1),
  profileFacilities: z.array(z.string().min(3)).min(1),
  contactTitle: z.string().min(5),
  contactDescription: z.string().min(10),
  footerDescription: z.string().min(10),
  footerCopyright: z.string().min(5),
  publicNav: z.array(navItemSchema).min(1),
  quickLinks: z.array(quickLinkSchema).min(1),
  contentBlocks: contentBlocksSchema,
});

export type CmsSettingsSchema = z.infer<typeof cmsSettingsSchema>;
