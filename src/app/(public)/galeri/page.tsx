import { PageHeader } from "@/components/shared/page-header";
import { GalleryPublicGrid } from "@/features/gallery/components/gallery-public-grid";
import { getGalleryItems } from "@/features/gallery/services/gallery-service";

export default async function GaleriPage() {
  const items = await getGalleryItems();

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Halaman Publik"
        title="Galeri"
        description="Dokumentasi kegiatan Masjid Nurul Jannah yang dikelola dari dashboard admin."
      />
      <GalleryPublicGrid items={items} />
    </div>
  );
}
