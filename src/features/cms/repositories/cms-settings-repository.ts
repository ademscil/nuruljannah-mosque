import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export async function findCmsSettings() {
  return prisma.cmsSettings.findFirst({
    orderBy: {
      updatedAt: "desc",
    },
  });
}

export async function upsertCmsSettings(data: {
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
  publicNav: Array<{ label: string; href: string }>;
  quickLinks: Array<{ title: string; description: string; href: string }>;
  contentBlocks: Record<string, unknown>;
}) {
  const payload = {
    siteName: data.siteName,
    siteShortName: data.siteShortName,
    siteTagline: data.siteTagline,
    contactAddress: data.contactAddress,
    contactCity: data.contactCity,
    contactEmail: data.contactEmail,
    contactPhone: data.contactPhone,
    contactMapUrl: data.contactMapUrl,
    homeFeatureTitle: data.homeFeatureTitle,
    homeFeatureDescription: data.homeFeatureDescription,
    homeServiceTitle: data.homeServiceTitle,
    homeServiceDescription: data.homeServiceDescription,
    homeCtaTitle: data.homeCtaTitle,
    homeCtaDescription: data.homeCtaDescription,
    profileTitle: data.profileTitle,
    profileDescription: data.profileDescription,
    profileSidebarTitle: data.profileSidebarTitle,
    profileSidebarDescription: data.profileSidebarDescription,
    profileSidebarItems: data.profileSidebarItems,
    profileFacilities: data.profileFacilities,
    contactTitle: data.contactTitle,
    contactDescription: data.contactDescription,
    footerDescription: data.footerDescription,
    footerCopyright: data.footerCopyright,
    publicNav: data.publicNav as Prisma.InputJsonValue,
    quickLinks: data.quickLinks as Prisma.InputJsonValue,
    contentBlocks: data.contentBlocks as Prisma.InputJsonValue,
  };

  if (data.id) {
    return prisma.cmsSettings.update({
      where: { id: data.id },
      data: payload,
    });
  }

  return prisma.cmsSettings.create({
    data: payload,
  });
}
