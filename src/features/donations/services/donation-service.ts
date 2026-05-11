import {
  findDonationCampaigns,
  findDonations,
} from "@/features/donations/repositories/donation-repository";
import type {
  DonationCampaignItem,
  DonationListItem,
  DonationSummary,
} from "@/features/donations/types/donation";

export async function getDonationCampaigns(): Promise<DonationCampaignItem[]> {
  try {
    const campaigns = await findDonationCampaigns();
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
      };
    });
  } catch (error) {
    console.error("Failed to load donation campaigns:", error);
    return [];
  }
}

export async function getDonations(): Promise<DonationListItem[]> {
  try {
    const donations = await findDonations();
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
    }));
  } catch (error) {
    console.error("Failed to load donations:", error);
    return [];
  }
}

export async function getPublicDonationCampaigns(): Promise<DonationCampaignItem[]> {
  const campaigns = await getDonationCampaigns();
  return campaigns.filter((item) => item.isActive);
}

export async function getPublicDonations(): Promise<DonationListItem[]> {
  const donations = await getDonations();
  return donations.filter((item) => item.status === "CONFIRMED");
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
