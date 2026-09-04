import Link from "next/link";
import { MapPin, Mail, Phone, ExternalLink, Navigation } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { getCmsSettings } from "@/features/cms/services/cms-settings-service";

export default async function KontakLokasiPage() {
  const cmsSettings = await getCmsSettings();
  const contactItems = [
    {
      icon: MapPin,
      label: "Alamat",
      value: cmsSettings.contactAddress,
      iconBg: "bg-primary/10 text-primary",
    },
    {
      icon: Mail,
      label: "Email Resmi",
      value: cmsSettings.contactEmail,
      href: `mailto:${cmsSettings.contactEmail}`,
      iconBg: "bg-amber-500/10 text-amber-600",
    },
    {
      icon: Phone,
      label: "Telepon / WhatsApp",
      value: cmsSettings.contactPhone,
      href: `tel:${cmsSettings.contactPhone}`,
      iconBg: "bg-emerald-500/10 text-emerald-600",
    },
  ];

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Informasi & Lokasi"
        title={cmsSettings.contactTitle}
        description={cmsSettings.contactDescription}
      />

      <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
        <div className="card-hero space-y-6 p-8">
          <div>
            <div className="badge-primary mb-3">
              {cmsSettings.contentBlocks.contactIntroBadge}
            </div>
            <h2 className="font-heading text-3xl font-semibold leading-snug">
              {cmsSettings.contentBlocks.contactIntroTitle}
            </h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              {cmsSettings.contentBlocks.contactIntroDescription}
            </p>
          </div>

          <div className="space-y-3">
            {contactItems.map((item) => (
              <div
                key={item.label}
                className="flex items-start gap-4 rounded-2xl border border-border/70 bg-card/60 p-5 backdrop-blur-sm transition-all hover:bg-card hover:border-primary/30"
              >
                <div
                  className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${item.iconBg}`}
                >
                  <item.icon className="size-5" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
                    {item.label}
                  </p>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="mt-1 block text-sm font-medium text-foreground transition-colors hover:text-primary"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="mt-1 text-sm font-medium leading-6">
                      {item.value}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Embedded Interactive Map Card */}
        <div className="card-hero overflow-hidden p-0 rounded-3xl border border-border/70 shadow-depth-lg flex flex-col">
          <div className="relative w-full h-80 sm:h-96 lg:h-[420px] bg-muted">
            <iframe
              title="Peta Lokasi Masjid Nurul Jannah"
              src="https://maps.google.com/maps?q=-2.1052125,106.0909844&hl=id&z=17&output=embed"
              className="w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
          <div className="p-6 bg-card flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border/40">
            <div>
              <p className="font-heading text-lg font-semibold text-foreground">
                Masjid Nurul Jannah
              </p>
              <p className="text-xs text-muted-foreground">
                {cmsSettings.contactCity}
              </p>
            </div>
            <Link
              href={cmsSettings.contactMapUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-primary inline-flex items-center gap-2 shrink-0"
            >
              <Navigation className="size-4" />
              Buka Petunjuk Arah
              <ExternalLink className="size-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
