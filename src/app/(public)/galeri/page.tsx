import { PublicPageTemplate } from "@/features/public/components/public-page-template";

export default function GaleriPage() {
  return (
    <PublicPageTemplate
      title="Galeri"
      description="Galeri kegiatan masjid yang nantinya dikelola penuh dari dashboard admin."
      previewTitle="Galeri kegiatan"
      previewDescription="Schema galeri sudah siap untuk judul, foto, kategori, tanggal kegiatan, dan status publikasi."
    />
  );
}
