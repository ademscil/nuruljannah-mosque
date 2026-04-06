import { PageHeader } from "@/components/shared/page-header";
import { DonationCampaignGrid } from "@/features/donations/components/donation-campaign-grid";
import { DonationRecentList } from "@/features/donations/components/donation-recent-list";
import { DonationSummaryCards } from "@/features/donations/components/donation-summary-cards";
import {
  getDonationCampaigns,
  getDonations,
  getDonationSummary,
} from "@/features/donations/services/donation-service";

export default async function DonasiPage() {
  const [campaigns, donations] = await Promise.all([
    getDonationCampaigns(),
    getDonations(),
  ]);
  const summary = getDonationSummary(campaigns, donations);

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Halaman Publik"
        title="Donasi dan Dukungan Jamaah"
        description="Lihat campaign aktif, progres penghimpunan dana, serta informasi rekening yang dikelola pengurus Masjid Nurul Jannah."
      />
      <DonationSummaryCards summary={summary} />
      <DonationCampaignGrid campaigns={campaigns} />
      <DonationRecentList
        donations={donations}
        title="Donasi Terbaru"
        description="Daftar donasi terbaru ditampilkan untuk memberi gambaran aktivitas dukungan jamaah kepada program masjid."
      />
    </div>
  );
}
