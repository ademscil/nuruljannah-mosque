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
} from "lucide-react";

import { DASHBOARD_PATHS } from "@/constants/routes";
import { ROLE_LABELS, type UserRole } from "@/constants/roles";
import { SITE_CONFIG } from "@/constants/site";
import { cn } from "@/lib/utils";

const dashboardNavigation = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutGrid },
  { label: "CMS Beranda", href: DASHBOARD_PATHS.cmsHome, icon: House },
  { label: "Pengumuman", href: DASHBOARD_PATHS.announcements, icon: Megaphone },
  { label: "Agenda Kegiatan", href: DASHBOARD_PATHS.events, icon: CalendarDays },
  { label: "Jadwal Petugas", href: DASHBOARD_PATHS.schedules, icon: CalendarClock },
  { label: "Keuangan", href: DASHBOARD_PATHS.finance, icon: Wallet },
  { label: "Donasi", href: DASHBOARD_PATHS.donations, icon: HeartHandshake },
  { label: "Data Pengurus", href: DASHBOARD_PATHS.management, icon: Users },
  { label: "Galeri", href: DASHBOARD_PATHS.gallery, icon: ImageIcon },
  { label: "Pengaturan Akun", href: DASHBOARD_PATHS.settings, icon: Settings },
];

type AppSidebarProps = {
  userName: string;
  role: UserRole;
};

export function AppSidebar({ userName, role }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden min-h-screen w-80 shrink-0 border-r border-white/10 bg-[linear-gradient(180deg,#0f2622_0%,#123630_42%,#163f38_100%)] text-white lg:flex lg:flex-col">
      <div className="space-y-2 border-b border-white/10 px-6 py-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-200/90">
          Admin CMS
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">
          {SITE_CONFIG.shortName}
        </h1>
        <p className="text-sm text-emerald-50/70">
          Kelola konten publik dan operasional masjid dari satu dashboard.
        </p>
      </div>

      <div className="space-y-4 px-4 py-5">
        <div className="rounded-[1.8rem] border border-white/10 bg-white/5 p-4 shadow-[0_20px_50px_-35px_rgba(0,0,0,0.5)] backdrop-blur">
          <p className="text-sm text-emerald-50/75">Masuk sebagai</p>
          <p className="mt-1 text-base font-semibold">{userName}</p>
          <p className="mt-2 text-sm text-emerald-100/70">{ROLE_LABELS[role]}</p>
        </div>

        <nav className="space-y-1">
          {dashboardNavigation.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === item.href
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-[1.2rem] px-4 py-3 text-sm font-medium transition",
                  isActive
                    ? "bg-white/12 text-white shadow-[0_16px_40px_-30px_rgba(0,0,0,0.6)]"
                    : "text-emerald-50/70 hover:bg-white/5 hover:text-white",
                )}
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
