"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarClock, CalendarDays, HeartHandshake, House,
  Image as ImageIcon, LayoutGrid, Megaphone, Settings,
  Users, Wallet, Building2, X, Sparkles,
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

type Props = { userName: string; role: UserRole; onClose?: () => void };

export function AppSidebar({ userName, role, onClose }: Props) {
  const pathname = usePathname();
  const nav = navItems.filter((item) => item.permission ? hasPermission(role, item.permission) : true);

  return (
    <aside className="relative flex h-full min-h-screen w-72 shrink-0 flex-col bg-gradient-to-br from-[oklch(0.22_0.04_175)] via-[oklch(0.20_0.04_175)] to-[oklch(0.18_0.04_175)] shadow-depth-lg">
      {/* Decorative gradient overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/5 opacity-50" />
      
      {/* Brand Header */}
      <div className="relative z-10 border-b border-white/10 px-6 py-6 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="card-3d-advanced flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-primary to-primary/80 text-white shadow-depth-md shadow-primary/30">
              <Building2 className="size-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-white drop-shadow-sm">{SITE_CONFIG.shortName}</p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary/90">Admin CMS</p>
            </div>
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="flex size-8 items-center justify-center rounded-lg text-white/60 transition-all hover:bg-white/10 hover:text-white"
              aria-label="Tutup menu"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </div>

      {/* User Profile Card with 3D effect */}
      <div className="relative z-10 px-4 pt-6">
        <div className="card-3d-advanced glass-ultra rounded-2xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-4 shadow-depth-md backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-primary to-primary/80 text-sm font-bold text-white shadow-depth-sm">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white drop-shadow-sm">{userName}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Sparkles className="size-3 text-primary" />
                <p className="text-xs font-medium text-primary">{ROLE_LABELS[role]}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation with 3D cards */}
      <nav className="relative z-10 flex-1 space-y-1 overflow-y-auto px-3 py-5 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
        {nav.map((item) => {
          const active = item.href === DASHBOARD_PATHS.overview
            ? pathname === item.href
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                active
                  ? "card-3d-advanced bg-gradient-to-r from-primary via-primary to-primary/90 text-white shadow-depth-md shadow-primary/40"
                  : "text-white/70 hover:bg-white/10 hover:text-white hover:shadow-depth-sm",
              )}
            >
              {active && (
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/20 to-transparent opacity-50 blur-xl" />
              )}
              <item.icon className={cn(
                "size-4 shrink-0 transition-transform duration-200",
                active ? "scale-110" : "group-hover:scale-110"
              )} />
              <span className="relative">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer with glass effect */}
      <div className="relative z-10 border-t border-white/10 px-4 py-4 backdrop-blur-sm">
        <div className="glass-frosted rounded-lg border border-white/10 bg-white/5 px-3 py-2.5">
          <p className="text-center text-[10px] font-medium text-white/50">
            {SITE_CONFIG.name}
          </p>
          <p className="text-center text-[9px] font-medium uppercase tracking-wider text-primary/70">
            Portal Admin
          </p>
        </div>
      </div>
    </aside>
  );
}
