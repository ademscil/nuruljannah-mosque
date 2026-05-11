import { PageHeader } from "@/components/shared/page-header";
import { getCmsSettings } from "@/features/cms/services/cms-settings-service";
import { AnnouncementPublicList } from "@/features/announcements/components/announcement-public-list";
import { getPublicAnnouncements } from "@/features/announcements/services/announcement-service";

export default async function PengumumanPage() {
  const [announcements, cms] = await Promise.all([
    getPublicAnnouncements(),
    getCmsSettings(),
  ]);

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Halaman Publik"
        title={cms.contentBlocks.pageCopy.pengumumanTitle}
        description={cms.contentBlocks.pageCopy.pengumumanDescription}
      />
      <AnnouncementPublicList announcements={announcements} />
    </div>
  );
}
