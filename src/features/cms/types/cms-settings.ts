export type CmsNavItem = {
  label: string;
  href: string;
};

export type CmsLinkItem = {
  title: string;
  description: string;
  href: string;
};

export type CmsStatItem = {
  label: string;
  value: string;
};

export type CmsFeatureItem = {
  title: string;
  description: string;
};

export type CmsServiceItem = {
  title: string;
  description: string;
};

export type CmsPageCopy = {
  agendaTitle: string;
  agendaDescription: string;
  pengumumanTitle: string;
  pengumumanDescription: string;
  donasiTitle: string;
  donasiDescription: string;
  donasiRecentTitle: string;
  donasiRecentDescription: string;
  galeriTitle: string;
  galeriDescription: string;
  jadwalTitle: string;
  jadwalDescription: string;
  keuanganTitle: string;
  keuanganDescription: string;
};

export type CmsContentBlocks = {
  heroVideoUrl: string;
  heroBadge: string;
  heroEyebrow: string;
  heroSecondaryButtonLabel: string;
  stats: CmsStatItem[];
  features: CmsFeatureItem[];
  services: CmsServiceItem[];
  quickLinksSectionTitle: string;
  quickLinksSectionBadge: string;
  ctaBadge: string;
  ctaPrimaryButtonLabel: string;
  ctaSecondaryButtonLabel: string;
  profileAboutTitle: string;
  profileAboutHeading: string;
  profileAboutContent: string;
  profileVisionTitle: string;
  profileVisionContent: string;
  profileMissionTitle: string;
  profileMissionContent: string;
  profileFacilitiesHeading: string;
  profileManagementBadge: string;
  profileManagementHeading: string;
  contactIntroBadge: string;
  contactIntroTitle: string;
  contactIntroDescription: string;
  contactMapButtonLabel: string;
  pageCopy: CmsPageCopy;
};

export type CmsSettingsRecord = {
  id?: string;
  siteName: string;
  siteShortName: string;
  siteTagline: string;
  contactAddress: string;
  contactCity: string;
  contactEmail: string;
  contactPhone: string;
  contactMapUrl: string;
  homeFeatureTitle: string;
  homeFeatureDescription: string;
  homeServiceTitle: string;
  homeServiceDescription: string;
  homeCtaTitle: string;
  homeCtaDescription: string;
  profileTitle: string;
  profileDescription: string;
  profileSidebarTitle: string;
  profileSidebarDescription: string;
  profileSidebarItems: string[];
  profileFacilities: string[];
  contactTitle: string;
  contactDescription: string;
  footerDescription: string;
  footerCopyright: string;
  publicNav: CmsNavItem[];
  quickLinks: CmsLinkItem[];
  contentBlocks: CmsContentBlocks;
};
