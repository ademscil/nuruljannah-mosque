"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarClock,
  CalendarDays,
  HeartHandshake,
  House,
  Image as ImageIcon,
  LayoutGrid,
  Megaphone,
  Settings,
  Users,
  Wallet,
  Building2,
  X,
  Shield,
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
    <aside className="relative flex h-full min-h-screen w-72 max-w-[calc(100vw-3rem)] shrink-0 flex-col bg-[oklch(0.18_0.035_170)] text-white/90 shadow-xl border-r border-white/10">
      {/* Brand Header */}
      <div className="relative z-10 border-b border-white/10 px-5 py-5 sm:px-6">
        <div className="flex items-center justify-between">
          <Link href={DASHBOARD_PATHS.overview} className="flex items-center gap-3 group">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md transition-transform duration-200 group-hover:scale-105">
              <Building2 className="size-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-white tracking-tight">{SITE_CONFIG.shortName}</p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary/80">CMS Pengurus</p>
            </div>
          </Link>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="flex size-11 min-h-[44px] min-w-[44px] sm:size-8 sm:min-h-8 sm:min-w-8 items-center justify-center rounded-lg text-white/60 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Tutup menu"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </div>

      {/* User Profile Card */}
      <div className="relative z-10 px-4 pt-4 sm:pt-5">
        <div className="rounded-xl border border-white/15 bg-white/5 p-3.5 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/30 text-white font-bold text-sm border border-primary/40">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">{userName}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Shield className="size-3 text-amber-400" />
                <p className="text-xs font-medium text-amber-300/90">{ROLE_LABELS[role]}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex-1 min-h-0 space-y-1 overflow-y-auto px-3.5 py-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10" aria-label="Menu CMS">
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
                "group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-150 min-h-[44px]",
                active
                  ? "bg-primary text-primary-foreground shadow-md font-semibold"
                  : "text-white/70 hover:bg-white/10 hover:text-white",
              )}
            >
              <item.icon className={cn(
                "size-4 shrink-0 transition-transform duration-150",
                active ? "scale-105 text-primary-foreground" : "text-white/60 group-hover:text-white"
              )} />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer info */}
      <div className="relative z-10 border-t border-white/10 px-4 py-3.5">
        <div className="rounded-lg bg-white/5 px-3 py-2 text-center">
          <p className="text-[10px] text-white/50">{SITE_CONFIG.name}</p>
          <p className="text-[9px] uppercase tracking-wider text-amber-300/80 font-semibold mt-0.5">Versi Produksi 2026</p>
        </div>
      </div>
    </aside>
  );
}
