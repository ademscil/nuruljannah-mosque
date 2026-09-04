"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import { Menu, X, Building2 } from "lucide-react";

import { ROUTE_PATHS } from "@/constants/routes";
import type { CmsNavItem } from "@/features/cms/types/cms-settings";

function MobileNavMenu({ pathname, nav }: { pathname: string; nav: CmsNavItem[] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Tutup menu" : "Buka menu"}
        aria-expanded={open}
        className="relative z-50 flex size-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-border bg-background text-foreground shadow-sm transition hover:bg-muted lg:hidden"
      >
        {open ? <X className="size-4" /> : <Menu className="size-4" />}
      </button>

      {open ? (
        <button
          type="button"
          aria-label="Tutup menu"
          className="fixed inset-0 top-[68px] z-40 bg-black/35 backdrop-blur-[2px] transition-opacity lg:hidden"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <div
        className={`fixed inset-x-0 top-[68px] z-50 px-4 transition-all duration-300 lg:hidden ${
          open ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"
        }`}
      >
        <div className="mt-2 max-h-[calc(100dvh-5rem)] overflow-y-auto pb-[max(1rem,env(safe-area-inset-bottom))] rounded-2xl border border-border bg-background/96 dark:bg-card/96 shadow-[0_16px_48px_-16px_oklch(0.18_0.018_250_/_0.18)] backdrop-blur-2xl">
          <nav className="flex flex-col gap-0.5 p-3" aria-label="Menu utama">
            {nav.map((item, i) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{ animationDelay: `${i * 35}ms` }}
                  onClick={() => setOpen(false)}
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
            <Link href={ROUTE_PATHS.login} className="btn-primary flex min-h-[44px] w-full items-center justify-center py-2.5 text-xs" onClick={() => setOpen(false)}>
              Login Admin
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export function PublicHeader({
  siteShortName,
  siteTagline,
  nav,
}: {
  siteShortName: string;
  siteTagline: string;
  nav: CmsNavItem[];
}) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? "border-b border-border bg-background/90 shadow-[0_2px_20px_-4px_oklch(0.18_0.018_250_/_0.08)] backdrop-blur-2xl"
            : "border-b border-transparent bg-background/70 backdrop-blur-lg"
        }`}
      >
        <div className="mx-auto flex max-w-[88rem] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link href={ROUTE_PATHS.home} className="group flex min-w-0 items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-[0_4px_12px_-4px_oklch(0.38_0.1_175_/_0.4)] transition-transform duration-200 group-hover:scale-105">
              <Building2 className="size-4" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-base font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
                {siteShortName}
              </p>
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                {siteTagline}
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-0.5 rounded-full border border-border/60 bg-muted/40 p-1 lg:flex" aria-label="Menu utama">
            {nav.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-150 ${
                    active
                      ? "nav-active shadow-sm"
                      : "text-muted-foreground hover:bg-background hover:text-foreground hover:shadow-sm"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Link href={ROUTE_PATHS.login} className="btn-primary hidden px-5 py-2 text-xs sm:inline-flex">
              Login Admin
            </Link>
            <Fragment key={pathname}>
              <MobileNavMenu pathname={pathname} nav={nav} />
            </Fragment>
          </div>
        </div>
      </header>
    </>
  );
}
