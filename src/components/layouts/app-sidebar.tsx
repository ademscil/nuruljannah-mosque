"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarClock, CalendarDays, HeartHandshake, House,
  Image as ImageIcon, LayoutGrid, Megaphone, Settings,
  Users, Wallet, Building2,
} from "lucide-react";

import { DASHBOARD_PATHS } from "@/constants/routes";
import { ROLE_LABELS, type UserRole } from "@/constants/roles";
import { SITE_CONFIG } from "@/constants/site";
import { hasPermission } from "@/lib/role-guard";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard",        href: DASHBOARD_PATHS.overview,       icon: LayoutGrid },
  { label: "CMS Beranda",      href: DASHBOARD_PATHS.cmsHome,        icon: House,          permission: "cms" },
  { label: "Pengumuman",       href: DASHBOARD_PATHS.announcements,  icon: Megaphone,      permission: "pengumuman" },
  { label: "Agenda Kegiatan",  href: DASHBOARD_PATHS.events,         icon: CalendarDays,   permission: "agenda" },
  { label: "Jadwal Petugas",   href: DASHBOARD_PATHS.schedules,      icon: CalendarClock,  permission: "jadwal-petugas" },
  { label: "Keuangan",         href: DASHBOARD_PATHS.finance,        icon: Wallet,         permission: "keuangan" },
  { label: "Donasi",           href: DASHBOARD_PATHS.donations,      icon: HeartHandshake, permission: "donasi" },
  { label: "Data Pengurus",    href: DASHBOARD_PATHS.management,     icon: Users,          permission: "pengurus" },
  { label: "Galeri",           href: DASHBOARD_PATHS.gallery,        icon: ImageIcon,      permission: "galeri" },
  { label: "Pengaturan Akun",  href: DASHBOARD_PATHS.settings,       icon: Settings },
];

type Props = { userName: string; role: UserRole };

export function AppSidebar({ userName, role }: Props) {
  const pathname = usePathname();
  const nav = navItems.filter((item) => item.permission ? hasPermission(role, item.permission) : true);

  return (
    <aside className="hidden min-h-screen w-72 shrink-0 flex-col bg-[oklch(0.2_0.04_175)] lg:flex">

      {/* Brand */}
      <div className="border-b border-[oklch(0.28_0.04_175)] px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-[oklch(0.68_0.14_82)] text-[oklch(0.15_0.02_250)] shadow-md">
            <Building2 className="size-4" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">{SITE_CONFIG.shortName}</p>
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[oklch(0.5_0.04_175)]">Admin CMS</p>
          </div>
        </div>
      </div>

      {/* User card */}
      <div className="px-4 pt-5">
        <div className="rounded-2xl border border-[oklch(0.28_0.04_175)] bg-[oklch(0.25_0.04_175)] p-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-[oklch(0.68_0.14_82)]/20 text-sm font-bold text-[oklch(0.68_0.14_82)]">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">{userName}</p>
              <p className="text-xs text-[oklch(0.68_0.14_82)]">{ROLE_LABELS[role]}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
        {nav.map((item) => {
          const active = item.href === DASHBOARD_PATHS.overview
            ? pathname === item.href
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-150",
                active
                  ? "bg-[oklch(0.68_0.14_82)] text-[oklch(0.15_0.02_250)] shadow-[0_4px_16px_-4px_oklch(0.68_0.14_82_/_0.4)]"
                  : "text-[oklch(0.65_0.03_175)] hover:bg-[oklch(0.26_0.04_175)] hover:text-white",
              )}
            >
              <item.icon className="size-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-[oklch(0.28_0.04_175)] px-4 py-4">
        <p className="text-center text-[10px] text-[oklch(0.4_0.03_175)]">
          {SITE_CONFIG.name} · Portal Admin
        </p>
      </div>
    </aside>
  );
}
