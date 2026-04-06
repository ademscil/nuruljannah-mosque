import Link from "next/link";
import { MapPin, Mail, Phone, ExternalLink, Navigation } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { SITE_CONFIG } from "@/constants/site";

const contactItems = [
  {
    icon: MapPin,
    label: "Alamat",
    value: SITE_CONFIG.contact.address,
    iconBg: "bg-primary/8 text-primary",
  },
  {
    icon: Mail,
    label: "Email",
    value: SITE_CONFIG.contact.email,
    href: `mailto:${SITE_CONFIG.contact.email}`,
    iconBg: "bg-amber-50 text-amber-600",
  },
  {
    icon: Phone,
    label: "Nomor Kontak",
    value: SITE_CONFIG.contact.phone,
    href: `tel:${SITE_CONFIG.contact.phone}`,
    iconBg: "bg-teal-50 text-teal-600",
  },
];

export default function KontakLokasiPage() {
  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Halaman Publik"
        title="Kontak & Lokasi"
        description="Informasi alamat, kontak, dan akses menuju Masjid Nurul Jannah untuk jamaah umum."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        {/* Contact info */}
        <div className="card-hero p-8 space-y-6">
          <div>
            <div className="badge-primary mb-3">Hubungi Kami</div>
            <h2 className="font-heading text-3xl font-semibold leading-snug">
              Datang langsung ke masjid
            </h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Masjid Nurul Jannah terbuka untuk seluruh jamaah. Silakan hubungi kami melalui kontak di bawah ini.
            </p>
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
                    <a href={item.href} className="mt-1 block text-sm font-medium text-foreground transition-colors hover:text-primary">
                      {item.value}
                    </a>
                  ) : (
                    <p className="mt-1 text-sm font-medium leading-6">{item.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Map */}
        <div className="card-hero overflow-hidden p-0">
          {/* Map placeholder — gradient with info */}
          <div className="relative flex h-64 items-center justify-center bg-gradient-to-br from-primary/8 via-teal-50/40 to-amber-50/30 lg:h-full lg:min-h-[400px]">
            <div className="orb -left-8 -top-8 size-40 bg-primary/6" />
            <div className="orb -bottom-8 right-0 size-32 bg-amber-100/30" />
            <div className="relative text-center space-y-4 px-8">
              <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary animate-float">
                <Navigation className="size-8" />
              </div>
              <div>
                <p className="font-heading text-2xl font-semibold">{SITE_CONFIG.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">{SITE_CONFIG.contact.city}</p>
              </div>
              <Link
                href={SITE_CONFIG.contact.mapUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-primary inline-flex"
              >
                <MapPin className="size-4" />
                Buka di Google Maps
                <ExternalLink className="size-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
