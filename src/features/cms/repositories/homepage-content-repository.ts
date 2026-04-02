import { prisma } from "@/lib/prisma";

export async function findLatestHomepageContent() {
  return prisma.homepageContent.findFirst({
    orderBy: {
      updatedAt: "desc",
    },
  });
}

export async function upsertHomepageContent(data: {
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
  const payload = {
    heroTitle: data.heroTitle,
    heroSubtitle: data.heroSubtitle,
    heroPrimaryCtaLabel: data.heroPrimaryCtaLabel,
    heroPrimaryCtaHref: data.heroPrimaryCtaHref,
    welcomeTitle: data.welcomeTitle,
    welcomeContent: data.welcomeContent,
    donationCtaTitle: data.donationCtaTitle,
    donationCtaDescription: data.donationCtaDescription,
    status: data.status,
    createdById: data.userId,
  };

  if (data.id) {
    return prisma.homepageContent.update({
      where: { id: data.id },
      data: payload,
    });
  }

  return prisma.homepageContent.create({
    data: payload,
  });
}
