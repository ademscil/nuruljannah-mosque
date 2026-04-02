import { PublicPageTemplate } from "@/features/public/components/public-page-template";

export default function ProfilMasjidPage() {
  return (
    <PublicPageTemplate
      title="Profil Masjid"
      description="Halaman profil masjid untuk sejarah singkat, visi misi, fasilitas, dan sambutan pengurus."
      previewTitle="Profil akan dikelola via CMS"
      previewDescription="Konten halaman publik tertentu akan dihubungkan ke modul CMS agar pengurus mudah memperbarui informasi profil."
    />
  );
}
