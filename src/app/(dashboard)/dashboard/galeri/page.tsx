import { AccessDenied } from "@/components/shared/access-denied";
import { PageHeader } from "@/components/shared/page-header";
import { GalleryAdminTable } from "@/features/gallery/components/gallery-admin-table";
import { getGalleryItems } from "@/features/gallery/services/gallery-service";
import { hasDashboardPermission } from "@/lib/dashboard-access";

export default async function DashboardGaleriPage() {
  const canAccess = await hasDashboardPermission("galeri");
  if (!canAccess) {
    return <AccessDenied />;
  }

  const items = await getGalleryItems();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="CMS Internal"
        title="Galeri"
        description="Kelola foto kegiatan, kategori, tanggal aktivitas, dan kesiapan tampil di halaman publik."
      />
      <GalleryAdminTable items={items} />
    </div>
  );
}
