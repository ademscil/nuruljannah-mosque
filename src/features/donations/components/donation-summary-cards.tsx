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
        description="Akumulasi dana dari seluruh campaign donasi"
        icon={HandCoins}
        trend="up"
        trendLabel={`${progress}% dari target`}
        iconColor="text-emerald-600"
        iconBg="bg-emerald-50"
      />
      <StatsCard
        title="Total Target"
        value={formatRupiah(summary.totalTarget)}
        description="Total target dana dari campaign aktif dan selesai"
        icon={Goal}
        iconColor="text-blue-600"
        iconBg="bg-blue-50"
      />
      <StatsCard
        title="Donatur Terkonfirmasi"
        value={`${summary.donorCount} orang`}
        description="Donatur dengan status donasi terverifikasi"
        icon={BadgeCheck}
        iconColor="text-purple-600"
        iconBg="bg-purple-50"
      />
      <StatsCard
        title="Campaign Aktif"
        value={`${summary.activeCampaignCount} program`}
        description="Program donasi yang masih dibuka untuk jamaah"
        icon={HeartHandshake}
        iconColor="text-amber-600"
        iconBg="bg-amber-50"
      />
    </div>
  );
}
