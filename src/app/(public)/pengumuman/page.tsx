import { PageHeader } from "@/components/shared/page-header";
import { AnnouncementPublicList } from "@/features/announcements/components/announcement-public-list";
import { getAnnouncements } from "@/features/announcements/services/announcement-service";

export default async function PengumumanPage() {
  const announcements = await getAnnouncements();

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Halaman Publik"
        title="Pengumuman"
        description="Daftar pengumuman penting untuk jamaah yang dikendalikan dari area admin."
      />
      <AnnouncementPublicList announcements={announcements} />
    </div>
  );
}
