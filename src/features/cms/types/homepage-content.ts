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
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  source: "database" | "fallback";
};
