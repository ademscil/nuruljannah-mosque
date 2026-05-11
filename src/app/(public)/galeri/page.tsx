import { PageHeader } from "@/components/shared/page-header";
import { getCmsSettings } from "@/features/cms/services/cms-settings-service";
import { GalleryPublicGrid } from "@/features/gallery/components/gallery-public-grid";
import { getPublicGalleryItems } from "@/features/gallery/services/gallery-service";

export default async function GaleriPage() {
  const [items, cms] = await Promise.all([getPublicGalleryItems(), getCmsSettings()]);

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Halaman Publik"
        title={cms.contentBlocks.pageCopy.galeriTitle}
        description={cms.contentBlocks.pageCopy.galeriDescription}
      />
      <GalleryPublicGrid items={items} />
    </div>
  );
}
