import { CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";

type PublicPageTemplateProps = {
  title: string;
  description: string;
  children: React.ReactNode;
  sidebarTitle?: string;
  sidebarDescription?: string;
  sidebarItems?: string[];
};

export function PublicPageTemplate({
  title,
  description,
  children,
  sidebarTitle,
  sidebarDescription,
  sidebarItems,
}: PublicPageTemplateProps) {
  return (
    <div className="space-y-10">
      <PageHeader eyebrow="Halaman Publik" title={title} description={description} />
      <div className="grid gap-8 xl:grid-cols-[1fr_320px]">
        <div className="space-y-6 min-w-0">{children}</div>
        <aside className="space-y-4">
          <div className="card-hero sticky top-24 p-7">
            <div className="badge-primary mb-4">Informasi</div>
            <h2 className="font-heading text-2xl leading-snug font-semibold">
              {sidebarTitle ?? title}
            </h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              {sidebarDescription ?? description}
            </p>
            {sidebarItems?.length ? (
              <ul className="mt-5 space-y-2.5">
                {sidebarItems.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </aside>
      </div>
    </div>
  );
}
