import Link from "next/link";

import { ROUTE_PATHS } from "@/constants/routes";
import { SITE_CONFIG } from "@/constants/site";

export function PublicFooter() {
  return (
    <footer className="relative mt-20 overflow-hidden border-t border-white/30 bg-[#0d2f2a] text-white">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/40 to-transparent" />
      <div className="absolute -left-12 top-10 size-52 rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="absolute right-0 top-0 size-64 rounded-full bg-teal-300/10 blur-3xl" />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.5fr_1fr_1fr] lg:px-8">
        <div className="space-y-4">
          <h3 className="font-heading text-3xl tracking-tight">{SITE_CONFIG.name}</h3>
          <p className="max-w-md text-sm leading-7 text-emerald-50/75">
            Website modern untuk informasi jamaah sekaligus fondasi CMS internal
            pengurus Masjid Nurul Jannah.
          </p>
          <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.24em] text-emerald-200/85">
            Untuk Jamaah dan Pengurus
          </div>
        </div>
        <div className="space-y-3">
          <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-100/70">
            Halaman Publik
          </h4>
          <div className="flex flex-col gap-3 text-sm">
            <Link className="transition hover:text-emerald-200" href={ROUTE_PATHS.events}>Agenda Kegiatan</Link>
            <Link className="transition hover:text-emerald-200" href={ROUTE_PATHS.announcements}>Pengumuman</Link>
            <Link className="transition hover:text-emerald-200" href={ROUTE_PATHS.donations}>Donasi</Link>
          </div>
        </div>
        <div className="space-y-3">
          <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-100/70">
            Kontak
          </h4>
          <div className="space-y-2 text-sm text-emerald-50/75">
            <p>{SITE_CONFIG.contact.address}</p>
            <p>{SITE_CONFIG.contact.email}</p>
            <p>{SITE_CONFIG.contact.phone}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
