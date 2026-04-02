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
