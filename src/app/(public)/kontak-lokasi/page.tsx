import Link from "next/link";
import { MapPin, Mail, Phone } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { SITE_CONFIG } from "@/constants/site";

export default function KontakLokasiPage() {
  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Halaman Publik"
        title="Kontak & Lokasi"
        description="Informasi alamat, kontak, dan akses menuju Masjid Nurul Jannah untuk jamaah umum."
      />
      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="glass-panel aurora-border rounded-[2.2rem] p-8 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.4)]">
          <h2 className="font-heading text-3xl font-semibold tracking-tight">
            Datang langsung ke masjid
          </h2>
          <div className="mt-6 space-y-4">
            <div className="flex items-start gap-3 rounded-2xl bg-muted/40 p-4">
              <MapPin className="mt-0.5 size-5 text-emerald-700 dark:text-emerald-300" />
              <div className="space-y-1">
                <p className="font-medium">Alamat</p>
                <p className="text-sm leading-7 text-muted-foreground">
                  {SITE_CONFIG.contact.address}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-2xl bg-muted/40 p-4">
              <Mail className="mt-0.5 size-5 text-emerald-700 dark:text-emerald-300" />
              <div className="space-y-1">
                <p className="font-medium">Email</p>
                <p className="text-sm text-muted-foreground">
                  {SITE_CONFIG.contact.email}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-2xl bg-muted/40 p-4">
              <Phone className="mt-0.5 size-5 text-emerald-700 dark:text-emerald-300" />
              <div className="space-y-1">
                <p className="font-medium">Nomor Kontak</p>
                <p className="text-sm text-muted-foreground">
                  {SITE_CONFIG.contact.phone}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="glass-panel aurora-border rounded-[2.2rem] p-8 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.4)]">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700 dark:text-emerald-300">
            Peta Lokasi
          </p>
          <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight">
            Masjid Nurul Jannah, {SITE_CONFIG.contact.city}
          </h2>
          <p className="mt-4 text-base leading-8 text-muted-foreground">
            Gunakan tautan Google Maps resmi untuk membuka navigasi langsung ke
            lokasi masjid.
          </p>
          <Link
            href={SITE_CONFIG.contact.mapUrl}
            target="_blank"
            rel="noreferrer"
            className="gradient-emerald mt-6 inline-flex h-11 items-center justify-center rounded-full px-6 text-sm font-semibold text-white shadow-[0_20px_60px_-25px_rgba(5,150,105,0.8)] transition hover:scale-[1.02]"
          >
            Buka di Google Maps
          </Link>
        </div>
      </div>
    </div>
  );
}
