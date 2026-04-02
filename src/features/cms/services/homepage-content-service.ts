import type { HomepageContentRecord } from "@/features/cms/types/homepage-content";

import {
  findLatestHomepageContent,
  upsertHomepageContent,
} from "@/features/cms/repositories/homepage-content-repository";

const fallbackHomepageContent: HomepageContentRecord = {
  heroTitle: "Masjid Nurul Jannah, pusat ibadah dan pemberdayaan umat.",
  heroSubtitle:
    "Informasi jamaah, agenda kegiatan, donasi, dan pengelolaan konten internal dalam satu platform modern.",
  heroPrimaryCtaLabel: "Lihat Agenda Terbaru",
  heroPrimaryCtaHref: "/agenda-kegiatan",
  welcomeTitle: "Sambutan Pengurus",
  welcomeContent:
    "Kami menghadirkan portal ini agar informasi masjid lebih tertata, transparan, dan mudah diakses oleh jamaah maupun pengurus.",
  donationCtaTitle: "Dukung Program Renovasi Tempat Wudhu",
  donationCtaDescription:
    "Salurkan donasi terbaik Anda untuk mendukung fasilitas ibadah yang lebih nyaman.",
  status: "PUBLISHED",
  source: "fallback",
};

export async function getHomepageContent(): Promise<HomepageContentRecord> {
  try {
    const content = await findLatestHomepageContent();

    if (!content) {
      return fallbackHomepageContent;
    }

    return {
      id: content.id,
      heroTitle: content.heroTitle,
      heroSubtitle: content.heroSubtitle,
      heroPrimaryCtaLabel: content.heroPrimaryCtaLabel,
      heroPrimaryCtaHref: content.heroPrimaryCtaHref,
      welcomeTitle: content.welcomeTitle,
      welcomeContent: content.welcomeContent,
      donationCtaTitle: content.donationCtaTitle,
      donationCtaDescription: content.donationCtaDescription,
      status: content.status,
      source: "database",
    };
  } catch {
    return fallbackHomepageContent;
  }
}

export async function saveHomepageContent(data: {
  id?: string;
  heroTitle: string;
  heroSubtitle: string;
  heroPrimaryCtaLabel: string;
  heroPrimaryCtaHref: string;
  welcomeTitle: string;
  welcomeContent: string;
  donationCtaTitle: string;
  donationCtaDescription: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  userId?: string;
}) {
  return upsertHomepageContent(data);
}
