export type DonationCampaignItem = {
  id: string;
  title: string;
  slug: string;
  description: string;
  targetAmount: number;
  collectedAmount: number;
  bankAccountName: string | null;
  bankAccountNumber: string | null;
  qrisImageUrl: string | null;
  isActive: boolean;
  donationCount: number;
  progress: number;
  source: "database" | "fallback";
};

export type DonationListItem = {
  id: string;
  donorName: string;
  donorEmail: string | null;
  donorPhone: string | null;
  amount: number;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  note: string | null;
  donatedAt: string;
  campaignId: string;
  campaignTitle: string;
  source: "database" | "fallback";
};

export type DonationSummary = {
  totalCollected: number;
  totalTarget: number;
  donorCount: number;
  activeCampaignCount: number;
};
