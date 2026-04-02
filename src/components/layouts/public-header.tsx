import Link from "next/link";

import { ThemeToggle } from "@/components/shared/theme-toggle";
import { ROUTE_PATHS } from "@/constants/routes";
import { SITE_CONFIG } from "@/constants/site";

const publicNavigation = [
  { label: "Profil", href: ROUTE_PATHS.profile },
  { label: "Jadwal Sholat", href: ROUTE_PATHS.prayerSchedule },
  { label: "Agenda", href: ROUTE_PATHS.events },
  { label: "Pengumuman", href: ROUTE_PATHS.announcements },
  { label: "Donasi", href: ROUTE_PATHS.donations },
  { label: "Galeri", href: ROUTE_PATHS.gallery },
  { label: "Kontak", href: ROUTE_PATHS.contact },
];

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/30 bg-background/70 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link
          href={ROUTE_PATHS.home}
          className="group flex flex-col transition duration-300 hover:translate-y-[-1px]"
        >
          <span className="text-lg font-semibold tracking-tight text-foreground transition group-hover:text-emerald-700 dark:group-hover:text-emerald-300">
            {SITE_CONFIG.name}
          </span>
          <span className="text-sm text-muted-foreground">
            Portal jamaah & pengurus
          </span>
        </Link>
        <nav className="hidden items-center gap-2 rounded-full border border-white/40 bg-white/55 px-3 py-2 shadow-[0_18px_60px_-30px_rgba(15,23,42,0.35)] backdrop-blur lg:flex dark:border-white/10 dark:bg-white/5">
          {publicNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition hover:bg-emerald-500/10 hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href={ROUTE_PATHS.login}
            className="gradient-emerald inline-flex h-10 items-center justify-center rounded-full px-5 text-sm font-semibold text-white shadow-[0_20px_40px_-20px_rgba(5,150,105,0.9)] transition hover:scale-[1.02]"
          >
            Login Admin
          </Link>
        </div>
      </div>
    </header>
  );
}
