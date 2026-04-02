import { ContentPreviewCard } from "@/components/shared/content-preview-card";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";

type PublicPageTemplateProps = {
  title: string;
  description: string;
  previewTitle: string;
  previewDescription: string;
};

export function PublicPageTemplate({
  title,
  description,
  previewTitle,
  previewDescription,
}: PublicPageTemplateProps) {
  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Halaman Publik"
        title={title}
        description={description}
      />
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="glass-panel aurora-border rounded-[2.2rem] p-8 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.4)]">
          <h2 className="font-heading text-3xl font-semibold tracking-tight">
            {title}
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-8 text-muted-foreground">
            Tahap fondasi sudah menyiapkan route publik dan struktur modular.
            Konten dinamis dari CMS internal akan disambungkan pada tahap fitur
            berikutnya.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button className="gradient-emerald rounded-full border-0 px-5 text-white hover:opacity-95">
              Lihat Demo Konten
            </Button>
            <Button variant="outline" className="rounded-full bg-white/60">
              Siapkan Integrasi CMS
            </Button>
          </div>
        </div>
        <ContentPreviewCard
          eyebrow="Preview"
          title={previewTitle}
          description={previewDescription}
        />
      </div>
    </div>
  );
}
