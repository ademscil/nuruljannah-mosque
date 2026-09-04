import { AccessDenied } from "@/components/shared/access-denied";
import { PageHeader } from "@/components/shared/page-header";
import { DonationAdminTable } from "@/features/donations/components/donation-admin-table";
import { DonationCampaignsSection } from "@/features/donations/components/donation-campaigns-section";
import { DonationRecentList } from "@/features/donations/components/donation-recent-list";
import { DonationSummaryCards } from "@/features/donations/components/donation-summary-cards";
import {
  getDonationCampaigns,
  getDonations,
  getDonationSummary,
} from "@/features/donations/services/donation-service";
import { hasDashboardPermission } from "@/lib/dashboard-access";

export default async function DashboardDonasiPage() {
  const canAccess = await hasDashboardPermission("donasi");
  if (!canAccess) {
    return <AccessDenied />;
  }

  const [campaigns, donations] = await Promise.all([
    getDonationCampaigns(),
    getDonations(),
  ]);
  const summary = getDonationSummary(campaigns, donations);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="CMS Internal"
        title="Donasi"
        description="Kelola campaign donasi, progres penghimpunan, daftar donatur, dan verifikasi manual oleh bendahara atau admin utama."
      />
      <DonationSummaryCards summary={summary} />
      <DonationCampaignsSection campaigns={campaigns} />
      <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        <DonationAdminTable campaigns={campaigns} donations={donations} />
        <DonationRecentList
          donations={donations}
          title="Aktivitas Donasi"
          description="Panel cepat untuk melihat transaksi terbaru dan memantau status verifikasi donasi."
        />
      </div>
    </div>
  );
}
