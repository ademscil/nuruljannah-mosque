import Link from "next/link";
import { MapPin, Mail, Phone, ExternalLink, Building2 } from "lucide-react";

import { ROUTE_PATHS } from "@/constants/routes";

const footerNav = {
  Halaman: [
    { label: "Profil Masjid", href: ROUTE_PATHS.profile },
    { label: "Agenda Kegiatan", href: ROUTE_PATHS.events },
    { label: "Pengumuman", href: ROUTE_PATHS.announcements },
    { label: "Donasi", href: ROUTE_PATHS.donations },
  ],
  Informasi: [
    { label: "Jadwal Sholat", href: ROUTE_PATHS.prayerSchedule },
    { label: "Laporan Keuangan", href: ROUTE_PATHS.finance },
    { label: "Galeri", href: ROUTE_PATHS.gallery },
    { label: "Kontak dan Lokasi", href: ROUTE_PATHS.contact },
  ],
};

export function PublicFooter({
  siteName,
  contactAddress,
  contactEmail,
  contactPhone,
  contactMapUrl,
  footerDescription,
  footerCopyright,
}: {
  siteName: string;
  contactAddress: string;
  contactEmail: string;
  contactPhone: string;
  contactMapUrl: string;
  footerDescription: string;
  footerCopyright: string;
}) {
  return (
    <footer className="mt-24 bg-[oklch(0.2_0.04_175)]">
      <div className="mx-auto max-w-[88rem] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_0.8fr_0.8fr_1.1fr]">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-[oklch(0.68_0.14_82)] text-[oklch(0.15_0.02_250)] shadow-lg">
                <Building2 className="size-5" />
              </div>
              <div>
                <p className="text-base font-bold text-white">{siteName}</p>
                <p className="text-xs text-[oklch(0.7_0.04_175)]">Portal Jamaah dan Pengurus</p>
              </div>
            </div>
            <p className="max-w-xs text-sm leading-7 text-[oklch(0.72_0.03_175)]">{footerDescription}</p>
            <Link
              href={contactMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-[oklch(0.35_0.05_175)] bg-[oklch(0.28_0.05_175)] px-4 py-2.5 text-xs font-semibold text-[oklch(0.85_0.04_175)] transition-colors hover:bg-[oklch(0.32_0.05_175)]"
            >
              <MapPin className="size-3.5" />
              Buka Google Maps
              <ExternalLink className="size-3" />
            </Link>
          </div>

          {Object.entries(footerNav).map(([group, links]) => (
            <div key={group} className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[oklch(0.68_0.14_82)]">{group}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-[oklch(0.68_0.03_175)] transition-colors hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[oklch(0.68_0.14_82)]">Kontak</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-[oklch(0.68_0.14_82)]" />
                <span className="text-sm leading-6 text-[oklch(0.68_0.03_175)]">{contactAddress}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="size-4 shrink-0 text-[oklch(0.68_0.14_82)]" />
                <a href={`mailto:${contactEmail}`} className="text-sm break-all text-[oklch(0.68_0.03_175)] transition-colors hover:text-white">
                  {contactEmail}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="size-4 shrink-0 text-[oklch(0.68_0.14_82)]" />
                <a href={`tel:${contactPhone}`} className="text-sm text-[oklch(0.68_0.03_175)] transition-colors hover:text-white">
                  {contactPhone}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-[oklch(0.28_0.04_175)] py-6 sm:flex-row">
          <p className="text-xs text-[oklch(0.5_0.03_175)]">
            (c) {new Date().getFullYear()} {siteName}. {footerCopyright}
          </p>
          <Link href={ROUTE_PATHS.login} className="text-xs text-[oklch(0.5_0.03_175)] transition-colors hover:text-[oklch(0.68_0.14_82)]">
            Masuk Admin {"->"}
          </Link>
        </div>
      </div>
    </footer>
  );
}
