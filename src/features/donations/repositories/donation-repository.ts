import { prisma } from "@/lib/prisma";

export async function findDonationCampaigns() {
  return prisma.donationCampaign.findMany({
    include: {
      donations: {
        orderBy: [
          {
            donatedAt: "desc",
          },
        ],
      },
    },
    orderBy: [
      {
        isActive: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
  });
}

export async function findDonations() {
  return prisma.donation.findMany({
    include: {
      campaign: true,
    },
    orderBy: [
      {
        donatedAt: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
  });
}
