"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  House,
  LayoutGrid,
  Menu,
  Wallet,
} from "lucide-react";
import { DASHBOARD_PATHS } from "@/constants/routes";
import { cn } from "@/lib/utils";

type AppBottomNavProps = {
  onOpenMenu: () => void;
};

const bottomNavItems = [
  {
    label: "Ringkasan",
    href: DASHBOARD_PATHS.overview,
    icon: LayoutGrid,
    exact: true,
  },
  {
    label: "Beranda",
    href: DASHBOARD_PATHS.cmsHome,
    icon: House,
    exact: false,
  },
  {
    label: "Keuangan",
    href: DASHBOARD_PATHS.finance,
    icon: Wallet,
    exact: false,
  },
  {
    label: "Agenda",
    href: DASHBOARD_PATHS.events,
    icon: CalendarDays,
    exact: false,
  },
];

export function AppBottomNav({ onOpenMenu }: AppBottomNavProps) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navigasi Mobile Pengurus"
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-border/70 bg-card/95 backdrop-blur-xl shadow-[0_-8px_30px_rgba(0,0,0,0.08)] lg:hidden pb-[env(safe-area-inset-bottom)]"
    >
      <div className="mx-auto flex h-16 max-w-lg items-center justify-around px-2">
        {bottomNavItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex flex-1 flex-col items-center justify-center py-1.5 transition-all active:scale-90",
                isActive
                  ? "text-primary font-bold"
                  : "text-muted-foreground hover:text-foreground font-medium",
              )}
            >
              {isActive && (
                <span className="absolute -top-1 size-1 rounded-full bg-primary" />
              )}
              <div
                className={cn(
                  "flex size-8 items-center justify-center rounded-xl transition-colors",
                  isActive ? "bg-primary/15 text-primary" : "text-muted-foreground",
                )}
              >
                <Icon className="size-4" />
              </div>
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </Link>
          );
        })}

        {/* Menu Drawer Opener */}
        <button
          type="button"
          onClick={onOpenMenu}
          className="flex flex-1 flex-col items-center justify-center py-1.5 text-muted-foreground hover:text-foreground font-medium transition-all active:scale-90"
          aria-label="Buka Semua Menu"
        >
          <div className="flex size-8 items-center justify-center rounded-xl bg-muted/60 text-muted-foreground">
            <Menu className="size-4" />
          </div>
          <span className="text-[10px] tracking-tight">Menu</span>
        </button>
      </div>
    </nav>
  );
}
