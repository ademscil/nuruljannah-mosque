"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, Building2 } from "lucide-react";

import { ThemeToggle } from "@/components/shared/theme-toggle";
import { ROUTE_PATHS } from "@/constants/routes";
import { SITE_CONFIG } from "@/constants/site";

const nav = [
  { label: "Profil", href: ROUTE_PATHS.profile },
  { label: "Jadwal Sholat", href: ROUTE_PATHS.prayerSchedule },
  { label: "Agenda", href: ROUTE_PATHS.events },
  { label: "Pengumuman", href: ROUTE_PATHS.announcements },
  { label: "Donasi", href: ROUTE_PATHS.donations },
  { label: "Galeri", href: ROUTE_PATHS.gallery },
  { label: "Kontak", href: ROUTE_PATHS.contact },
];

export function PublicHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? "border-b border-border bg-white/90 shadow-[0_2px_20px_-4px_oklch(0.18_0.018_250_/_0.08)] backdrop-blur-2xl"
            : "border-b border-transparent bg-white/70 backdrop-blur-lg"
        }`}
      >
        <div className="mx-auto flex max-w-[88rem] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">

          {/* Logo */}
          <Link href={ROUTE_PATHS.home} className="group flex items-center gap-3 min-w-0">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-[0_4px_12px_-4px_oklch(0.38_0.1_175_/_0.4)] transition-transform duration-200 group-hover:scale-105">
              <Building2 className="size-4" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-base font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
                {SITE_CONFIG.shortName}
              </p>
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Nurul Jannah
              </p>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-0.5 rounded-full border border-border/60 bg-muted/40 p-1 lg:flex">
            {nav.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-150 ${
                    active
                      ? "nav-active shadow-sm"
                      : "text-muted-foreground hover:bg-white hover:text-foreground hover:shadow-sm"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href={ROUTE_PATHS.login} className="btn-primary hidden px-5 py-2 text-xs sm:inline-flex">
              Login Admin
            </Link>
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
              className="flex size-9 items-center justify-center rounded-full border border-border bg-white text-foreground shadow-sm transition hover:bg-muted lg:hidden"
            >
              {open ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-x-0 top-[57px] z-30 px-4 transition-all duration-300 lg:hidden ${
          open ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"
        }`}
      >
        <div className="mt-2 overflow-hidden rounded-2xl border border-border bg-white/96 shadow-[0_16px_48px_-16px_oklch(0.18_0.018_250_/_0.18)] backdrop-blur-2xl">
          <nav className="flex flex-col gap-0.5 p-3">
            {nav.map((item, i) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{ animationDelay: `${i * 35}ms` }}
                  className={`animate-fade-down rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                    active ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="border-t border-border p-3">
            <Link href={ROUTE_PATHS.login} className="btn-primary w-full justify-center py-2.5 text-xs">
              Login Admin
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
