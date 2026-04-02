export const USER_ROLE = {
  ADMIN_UTAMA: "ADMIN_UTAMA",
  BENDAHARA: "BENDAHARA",
  SEKRETARIS: "SEKRETARIS",
  KOORDINATOR_KEGIATAN: "KOORDINATOR_KEGIATAN",
  JAMAAH_UMUM: "JAMAAH_UMUM",
} as const;

export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];

export const ROLE_LABELS: Record<UserRole, string> = {
  ADMIN_UTAMA: "Admin Utama",
  BENDAHARA: "Bendahara",
  SEKRETARIS: "Sekretaris",
  KOORDINATOR_KEGIATAN: "Koordinator Kegiatan",
  JAMAAH_UMUM: "Jamaah Umum",
};

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  ADMIN_UTAMA: ["*"],
  BENDAHARA: ["keuangan", "donasi", "laporan"],
  SEKRETARIS: ["pengumuman", "agenda", "pengurus", "galeri", "cms"],
  KOORDINATOR_KEGIATAN: ["jadwal-petugas", "agenda"],
  JAMAAH_UMUM: [],
};
