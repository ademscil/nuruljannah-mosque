import { BadgeCheck, Goal, HandCoins, HeartHandshake } from "lucide-react";

import { StatsCard } from "@/components/shared/stats-card";
import { formatRupiah } from "@/lib/format-rupiah";
import type { DonationSummary } from "@/features/donations/types/donation";

type DonationSummaryCardsProps = {
  summary: DonationSummary;
};

export function DonationSummaryCards({
  summary,
}: DonationSummaryCardsProps) {
  const progress =
    summary.totalTarget > 0
      ? Math.round((summary.totalCollected / summary.totalTarget) * 100)
      : 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatsCard
        title="Total Terkumpul"
        value={formatRupiah(summary.totalCollected)}
        description="Akumulasi dana dari seluruh campaign donasi."
        icon={HandCoins}
        trend="up"
        trendLabel={`${progress}% dari target`}
      />
      <StatsCard
        title="Total Target"
        value={formatRupiah(summary.totalTarget)}
        description="Total target dana dari campaign aktif dan nonaktif."
        icon={Goal}
      />
      <StatsCard
        title="Donatur Terkonfirmasi"
        value={`${summary.donorCount} orang`}
        description="Donatur dengan status donasi yang sudah terverifikasi."
        icon={BadgeCheck}
      />
      <StatsCard
        title="Campaign Aktif"
        value={`${summary.activeCampaignCount} program`}
        description="Program donasi yang masih dibuka untuk jamaah."
        icon={HeartHandshake}
      />
    </div>
  );
}
