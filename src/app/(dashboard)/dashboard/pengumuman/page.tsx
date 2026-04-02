import { PageHeader } from "@/components/shared/page-header";
import { ContentPreviewCard } from "@/components/shared/content-preview-card";
import { AnnouncementAdminTable } from "@/features/announcements/components/announcement-admin-table";
import { getAnnouncements } from "@/features/announcements/services/announcement-service";

export default async function DashboardPengumumanPage() {
  const announcements = await getAnnouncements();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="CMS Internal"
        title="Manajemen Pengumuman"
        description="List pengumuman admin sudah aktif dengan search, filter status, sorting, dan sumber data demo atau database."
      />
      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <AnnouncementAdminTable announcements={announcements} />
        <ContentPreviewCard
          eyebrow="Tahap Lanjut"
          title="Form CRUD Pengumuman"
          description="Schema dan struktur modul pengumuman sudah disiapkan. Tahap berikutnya tinggal menambahkan form create, edit, delete, upload thumbnail, dan publish workflow."
        />
      </div>
    </div>
  );
}
