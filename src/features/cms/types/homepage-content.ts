export type HomepageContentRecord = {
  id?: string;
  heroTitle: string;
  heroSubtitle: string;
  heroPrimaryCtaLabel: string;
  heroPrimaryCtaHref: string;
  welcomeTitle: string;
  welcomeContent: string;
  donationCtaTitle: string;
  donationCtaDescription: string;
  featuredAnnouncementId: string | null;
  featuredEventId: string | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
};
