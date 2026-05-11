import Link from "next/link";
import { MapPin, Mail, Phone, ExternalLink, Navigation } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { getCmsSettings } from "@/features/cms/services/cms-settings-service";

export default async function KontakLokasiPage() {
  const cmsSettings = await getCmsSettings();
  const contactItems = [
    { icon: MapPin, label: "Alamat", value: cmsSettings.contactAddress, iconBg: "bg-primary/8 text-primary" },
    { icon: Mail, label: "Email", value: cmsSettings.contactEmail, href: `mailto:${cmsSettings.contactEmail}`, iconBg: "bg-amber-50 text-amber-600" },
    { icon: Phone, label: "Nomor Kontak", value: cmsSettings.contactPhone, href: `tel:${cmsSettings.contactPhone}`, iconBg: "bg-teal-50 text-teal-600" },
  ];

  return (
    <div className="space-y-10">
      <PageHeader eyebrow="Halaman Publik" title={cmsSettings.contactTitle} description={cmsSettings.contactDescription} />

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="card-hero space-y-6 p-8">
          <div>
            <div className="badge-primary mb-3">{cmsSettings.contentBlocks.contactIntroBadge}</div>
            <h2 className="font-heading text-3xl font-semibold leading-snug">{cmsSettings.contentBlocks.contactIntroTitle}</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">{cmsSettings.contentBlocks.contactIntroDescription}</p>
          </div>

          <div className="space-y-3">
            {contactItems.map((item) => (
              <div key={item.label} className="flex items-start gap-4 rounded-2xl border border-border bg-muted/30 p-5 transition-colors hover:bg-white">
                <div className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${item.iconBg}`}>
                  <item.icon className="size-5" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">{item.label}</p>
                  {item.href ? (
                    <a href={item.href} className="mt-1 block text-sm font-medium text-foreground transition-colors hover:text-primary">{item.value}</a>
                  ) : (
                    <p className="mt-1 text-sm font-medium leading-6">{item.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card-hero overflow-hidden p-0">
          <div className="relative flex h-64 items-center justify-center bg-gradient-to-br from-primary/8 via-teal-50/40 to-amber-50/30 lg:h-full lg:min-h-[400px]">
            <div className="relative space-y-4 px-8 text-center">
              <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary animate-float">
                <Navigation className="size-8" />
              </div>
              <div>
                <p className="font-heading text-2xl font-semibold">{cmsSettings.siteName}</p>
                <p className="mt-1 text-sm text-muted-foreground">{cmsSettings.contactCity}</p>
              </div>
              <Link href={cmsSettings.contactMapUrl} target="_blank" rel="noreferrer" className="btn-primary inline-flex">
                <MapPin className="size-4" />
                {cmsSettings.contentBlocks.contactMapButtonLabel}
                <ExternalLink className="size-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
