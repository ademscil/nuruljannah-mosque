import { PageHeader } from "@/components/shared/page-header";
import { HomepageContentForm } from "@/features/cms/components/homepage-content-form";
import { getHomepageContent } from "@/features/cms/services/homepage-content-service";

export default async function CmsBerandaPage() {
  const homepageContent = await getHomepageContent();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="CMS Internal"
        title="CMS Beranda"
        description="Kelola hero, sambutan singkat, agenda unggulan, pengumuman pilihan, dan CTA donasi dari dashboard admin."
      />
      <HomepageContentForm initialData={homepageContent} />
    </div>
  );
}
