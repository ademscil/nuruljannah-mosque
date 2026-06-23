import { AccessDenied } from "@/components/shared/access-denied";
import { PageHeader } from "@/components/shared/page-header";
import { AnnouncementAdminTable } from "@/features/announcements/components/announcement-admin-table";
import { getAnnouncements } from "@/features/announcements/services/announcement-service";
import { hasDashboardPermission } from "@/lib/dashboard-access";

export default async function DashboardPengumumanPage() {
  const canAccess = await hasDashboardPermission("pengumuman");
  if (!canAccess) {
    return <AccessDenied />;
  }

  const announcements = await getAnnouncements();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="CMS Internal"
        title="Manajemen Pengumuman"
        description="Kelola pengumuman, status publish, isi konten, kategori, dan tanggal tampil dari dashboard admin."
      />
      <AnnouncementAdminTable announcements={announcements} />
    </div>
  );
}
