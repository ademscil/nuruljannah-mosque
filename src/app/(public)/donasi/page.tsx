import { PageHeader } from "@/components/shared/page-header";
import { getCmsSettings } from "@/features/cms/services/cms-settings-service";
import { DonationCampaignGrid } from "@/features/donations/components/donation-campaign-grid";
import { DonationRecentList } from "@/features/donations/components/donation-recent-list";
import { DonationSummaryCards } from "@/features/donations/components/donation-summary-cards";
import {
  getDonationSummary,
  getPublicDonationCampaigns,
  getPublicDonations,
} from "@/features/donations/services/donation-service";

export default async function DonasiPage() {
  const [campaigns, donations, cms] = await Promise.all([
    getPublicDonationCampaigns(),
    getPublicDonations(),
    getCmsSettings(),
  ]);
  const summary = getDonationSummary(campaigns, donations);

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Halaman Publik"
        title={cms.contentBlocks.pageCopy.donasiTitle}
        description={cms.contentBlocks.pageCopy.donasiDescription}
      />
      <DonationSummaryCards summary={summary} />
      <DonationCampaignGrid campaigns={campaigns} />
      <DonationRecentList
        donations={donations}
        title={cms.contentBlocks.pageCopy.donasiRecentTitle}
        description={cms.contentBlocks.pageCopy.donasiRecentDescription}
      />
    </div>
  );
}
