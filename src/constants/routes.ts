export const ROUTE_PATHS = {
  home: "/",
  login: "/login",
  dashboard: "/dashboard",
  profile: "/profil-masjid",
  prayerSchedule: "/jadwal-sholat",
  events: "/agenda-kegiatan",
  announcements: "/pengumuman",
  donations: "/donasi",
  finance: "/laporan-keuangan",
  gallery: "/galeri",
  contact: "/kontak-lokasi",
} as const;

export const DASHBOARD_PATHS = {
  overview: "/dashboard",
  cmsHome: "/dashboard/cms-beranda",
  announcements: "/dashboard/pengumuman",
  events: "/dashboard/agenda-kegiatan",
  schedules: "/dashboard/jadwal-petugas",
  finance: "/dashboard/keuangan",
  donations: "/dashboard/donasi",
  management: "/dashboard/data-pengurus",
  gallery: "/dashboard/galeri",
  settings: "/dashboard/pengaturan-akun",
} as const;

export const DASHBOARD_LABELS: Record<string, string> = {
  [DASHBOARD_PATHS.overview]: "Dashboard",
  [DASHBOARD_PATHS.cmsHome]: "CMS Beranda",
  [DASHBOARD_PATHS.announcements]: "Pengumuman",
  [DASHBOARD_PATHS.events]: "Agenda Kegiatan",
  [DASHBOARD_PATHS.schedules]: "Jadwal Petugas",
  [DASHBOARD_PATHS.finance]: "Keuangan",
  [DASHBOARD_PATHS.donations]: "Donasi",
  [DASHBOARD_PATHS.management]: "Data Pengurus",
  [DASHBOARD_PATHS.gallery]: "Galeri",
  [DASHBOARD_PATHS.settings]: "Pengaturan Akun",
} as const;
