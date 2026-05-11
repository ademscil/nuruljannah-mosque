import type { HomepageContentRecord } from "@/features/cms/types/homepage-content";
import { ROUTE_PATHS } from "@/constants/routes";

import {
  findLatestHomepageContent,
  findLatestPublishedHomepageContent,
  upsertHomepageContent,
} from "@/features/cms/repositories/homepage-content-repository";

const emptyHomepageContent: HomepageContentRecord = {
  heroTitle: "",
  heroSubtitle: "",
  heroPrimaryCtaLabel: "Lihat Agenda",
  heroPrimaryCtaHref: ROUTE_PATHS.events,
  welcomeTitle: "",
  welcomeContent: "",
  donationCtaTitle: "",
  donationCtaDescription: "",
  featuredAnnouncementId: null,
  featuredEventId: null,
  status: "DRAFT",
};

export async function getHomepageContent(): Promise<HomepageContentRecord> {
  try {
    const published = await findLatestPublishedHomepageContent();
    const content = published ?? (await findLatestHomepageContent());

    if (!content) {
      return emptyHomepageContent;
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
      featuredAnnouncementId: content.featuredAnnouncementId,
      featuredEventId: content.featuredEventId,
      status: content.status,
    };
  } catch (error) {
    console.error("Failed to load homepage content:", error);
    return emptyHomepageContent;
  }
}

export async function getHomepageContentForCms(): Promise<HomepageContentRecord> {
  try {
    const content = await findLatestHomepageContent();

    if (!content) {
      return emptyHomepageContent;
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
      featuredAnnouncementId: content.featuredAnnouncementId,
      featuredEventId: content.featuredEventId,
      status: content.status,
    };
  } catch (error) {
    console.error("Failed to load homepage content for CMS:", error);
    return emptyHomepageContent;
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
  featuredAnnouncementId?: string;
  featuredEventId?: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  userId?: string;
}) {
  return upsertHomepageContent(data);
}
