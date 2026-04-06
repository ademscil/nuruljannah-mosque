import {
  findDonationCampaigns,
  findDonations,
} from "@/features/donations/repositories/donation-repository";
import type {
  DonationCampaignItem,
  DonationListItem,
  DonationSummary,
} from "@/features/donations/types/donation";

const fallbackCampaigns: DonationCampaignItem[] = [
  {
    id: "campaign-demo-1",
    title: "Renovasi Tempat Wudhu",
    slug: "renovasi-tempat-wudhu",
    description:
      "Penggalangan dana untuk renovasi area tempat wudhu agar lebih nyaman dan aman bagi jamaah.",
    targetAmount: 50000000,
    collectedAmount: 21500000,
    bankAccountName: "Masjid Nurul Jannah",
    bankAccountNumber: "1234567890",
    qrisImageUrl: null,
    isActive: true,
    donationCount: 1,
    progress: 43,
    source: "fallback",
  },
];

const fallbackDonations: DonationListItem[] = [
  {
    id: "donation-demo-1",
    donorName: "Ibu Siti Rahmah",
    donorEmail: null,
    donorPhone: "081298765432",
    amount: 1500000,
    status: "CONFIRMED",
    note: null,
    donatedAt: "2026-04-02T14:00:00+07:00",
    campaignId: "campaign-demo-1",
    campaignTitle: "Renovasi Tempat Wudhu",
    source: "fallback",
  },
  {
    id: "donation-demo-2",
    donorName: "Hamba Allah",
    donorEmail: null,
    donorPhone: null,
    amount: 750000,
    status: "PENDING",
    note: "Transfer menunggu verifikasi bendahara.",
    donatedAt: "2026-04-01T10:30:00+07:00",
    campaignId: "campaign-demo-1",
    campaignTitle: "Renovasi Tempat Wudhu",
    source: "fallback",
  },
];

export async function getDonationCampaigns(): Promise<DonationCampaignItem[]> {
  try {
    const campaigns = await findDonationCampaigns();

    if (campaigns.length === 0) {
      return fallbackCampaigns;
    }

    return campaigns.map((campaign) => {
      const targetAmount = Number(campaign.targetAmount);
      const collectedAmount = Number(campaign.collectedAmount);

      return {
        id: campaign.id,
        title: campaign.title,
        slug: campaign.slug,
        description: campaign.description,
        targetAmount,
        collectedAmount,
        bankAccountName: campaign.bankAccountName ?? null,
        bankAccountNumber: campaign.bankAccountNumber ?? null,
        qrisImageUrl: campaign.qrisImageUrl ?? null,
        isActive: campaign.isActive,
        donationCount: campaign.donations.length,
        progress:
          targetAmount > 0
            ? Math.min(100, Math.round((collectedAmount / targetAmount) * 100))
            : 0,
        source: "database",
      };
    });
  } catch {
    return fallbackCampaigns;
  }
}

export async function getDonations(): Promise<DonationListItem[]> {
  try {
    const donations = await findDonations();

    if (donations.length === 0) {
      return fallbackDonations;
    }

    return donations.map((donation) => ({
      id: donation.id,
      donorName: donation.donorName,
      donorEmail: donation.donorEmail ?? null,
      donorPhone: donation.donorPhone ?? null,
      amount: Number(donation.amount),
      status: donation.status,
      note: donation.note ?? null,
      donatedAt: donation.donatedAt.toISOString(),
      campaignId: donation.campaignId,
      campaignTitle: donation.campaign.title,
      source: "database",
    }));
  } catch {
    return fallbackDonations;
  }
}

export function getDonationSummary(
  campaigns: DonationCampaignItem[],
  donations: DonationListItem[],
): DonationSummary {
  return {
    totalCollected: campaigns.reduce((sum, item) => sum + item.collectedAmount, 0),
    totalTarget: campaigns.reduce((sum, item) => sum + item.targetAmount, 0),
    donorCount: donations.filter((item) => item.status === "CONFIRMED").length,
    activeCampaignCount: campaigns.filter((item) => item.isActive).length,
  };
}
