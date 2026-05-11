import { ROUTE_PATHS } from "@/constants/routes";
import type { CmsSettingsRecord } from "@/features/cms/types/cms-settings";
import { findCmsSettings, upsertCmsSettings } from "@/features/cms/repositories/cms-settings-repository";

const defaultCmsSettings: CmsSettingsRecord = {
  siteName: "Masjid Nurul Jannah",
  siteShortName: "Nurul Jannah",
  siteTagline: "Portal Jamaah & Pengurus",
  contactAddress:
    "V3VR+W99, Taman Bunga, Kec. Gerunggang, Kota Pangkal Pinang, Kepulauan Bangka Belitung",
  contactCity: "Pangkal Pinang, Bangka Belitung",
  contactEmail: "admin@nuruljannah.id",
  contactPhone: "+62 812-3456-7890",
  contactMapUrl: "https://www.google.com/maps",
  homeFeatureTitle: "Portal publik yang lebih mudah dipahami",
  homeFeatureDescription:
    "Dirancang terang, ringan, dan fokus pada informasi yang paling sering dibutuhkan jamaah maupun pengurus.",
  homeServiceTitle: "Area publik dan dashboard admin terhubung dalam satu sistem.",
  homeServiceDescription:
    "Jamaah melihat informasi kegiatan, pengumuman, donasi, dan laporan ringkas. Pengurus mengelola seluruh konten dari dashboard internal yang terhubung langsung ke database.",
  homeCtaTitle: "Masjid yang lebih terhubung dengan jamaahnya.",
  homeCtaDescription:
    "Akses informasi kegiatan, donasi, dan pengumuman resmi kapan saja dan di mana saja.",
  profileTitle: "Profil Masjid",
  profileDescription:
    "Sejarah singkat, visi misi, fasilitas, dan struktur pengurus Masjid Nurul Jannah.",
  profileSidebarTitle: "Masjid Nurul Jannah",
  profileSidebarDescription:
    "Masjid Nurul Jannah hadir sebagai ruang ibadah, pembinaan, dan kebersamaan jamaah di Pangkal Pinang.",
  profileSidebarItems: [
    "Alamat resmi terhubung ke Google Maps",
    "Pengurus dan informasi publik dikelola dari CMS internal",
    "Konten profil dapat diperbarui langsung dari dashboard admin",
  ],
  profileFacilities: [
    "Ruang utama sholat berjamaah berkapasitas besar",
    "Area tempat wudhu jamaah putra dan putri",
    "Ruang kegiatan pembinaan dan kajian",
    "Area koordinasi pengurus dan kegiatan sosial",
    "Perpustakaan mini koleksi buku Islam",
    "Area parkir kendaraan jamaah",
  ],
  contactTitle: "Kontak & Lokasi",
  contactDescription:
    "Informasi alamat, kontak, dan akses menuju Masjid Nurul Jannah untuk jamaah umum.",
  footerDescription:
    "Informasi publik, jadwal kegiatan, transparansi keuangan, dan CMS internal tersusun dalam satu portal yang ringan dan mudah diakses.",
  footerCopyright: "Hak cipta dilindungi.",
  publicNav: [
    { label: "Profil", href: ROUTE_PATHS.profile },
    { label: "Jadwal Sholat", href: ROUTE_PATHS.prayerSchedule },
    { label: "Agenda", href: ROUTE_PATHS.events },
    { label: "Pengumuman", href: ROUTE_PATHS.announcements },
    { label: "Donasi", href: ROUTE_PATHS.donations },
    { label: "Laporan Keuangan", href: ROUTE_PATHS.finance },
    { label: "Galeri", href: ROUTE_PATHS.gallery },
    { label: "Kontak", href: ROUTE_PATHS.contact },
  ],
  quickLinks: [
    {
      title: "Lihat Agenda Kegiatan",
      description: "Tampilkan jadwal kegiatan masjid yang akan datang.",
      href: ROUTE_PATHS.events,
    },
    {
      title: "Buka Pengumuman",
      description: "Baca informasi terbaru yang dipublikasikan pengurus.",
      href: ROUTE_PATHS.announcements,
    },
    {
      title: "Masuk Dashboard Admin",
      description: "Kelola konten publik dan data operasional dari CMS internal.",
      href: ROUTE_PATHS.login,
    },
  ],
  contentBlocks: {
    heroVideoUrl: "https://upload.wikimedia.org/wikipedia/commons/transcoded/f/f4/Great_Mosque_of_Mecca_%284k_video%29_-_May_27%2C_2014.webm/Great_Mosque_of_Mecca_%284k_video%29_-_May_27%2C_2014.webm.720p.vp9.webm",
    heroBadge: "Website Resmi Masjid Nurul Jannah",
    heroEyebrow: "Pusat Informasi Jamaah dan Pengurus",
    heroSecondaryButtonLabel: "Lihat Lokasi",
    stats: [
      { label: "Agenda Aktif", value: "4+" },
      { label: "Informasi Publik", value: "Terpusat" },
      { label: "CMS Pengurus", value: "Siap Pakai" },
    ],
    features: [
      { title: "Agenda dan Kajian", description: "Jamaah dapat melihat agenda kegiatan, kajian, dan program masjid dengan tampilan yang jelas dan mudah dipahami." },
      { title: "Pengumuman Resmi", description: "Pengurus mempublikasikan informasi penting secara tertata langsung dari dashboard internal." },
      { title: "Donasi dan Keuangan", description: "Area donasi dan ringkasan keuangan tersedia untuk transparansi penuh kepada seluruh jamaah." },
      { title: "Operasional Pengurus", description: "Role pengurus, jadwal petugas, dan CMS internal terkelola dari dashboard yang rapi dan efisien." },
    ],
    services: [
      { title: "Jadwal Terpusat", description: "Jadwal ibadah dan petugas lebih cepat diakses dari satu tempat." },
      { title: "Donasi Transparan", description: "Campaign, donatur, dan progres penghimpunan dana dipantau dari satu modul." },
      { title: "Alamat Resmi", description: "Lokasi masjid di Pangkal Pinang terhubung langsung ke Google Maps." },
    ],
    quickLinksSectionTitle: "Akses Cepat",
    quickLinksSectionBadge: "Akses Cepat",
    ctaBadge: "Bergabung Bersama Kami",
    ctaPrimaryButtonLabel: "Lihat Agenda",
    ctaSecondaryButtonLabel: "Donasi Sekarang",
    profileAboutTitle: "Tentang Masjid",
    profileAboutHeading: "Pusat ibadah dan pemberdayaan jamaah di lingkungan Taman Bunga.",
    profileAboutContent: "Website ini disusun untuk memudahkan jamaah mendapatkan informasi kegiatan, pengumuman, jadwal petugas, donasi, dan transparansi keuangan. Di saat yang sama, pengurus memiliki area admin khusus untuk mengelola seluruh konten publik dari satu dashboard.",
    profileVisionTitle: "Visi",
    profileVisionContent: "Menjadi masjid yang ramah, tertib, aktif dalam pembinaan umat, dan terbuka dalam pelayanan kepada jamaah.",
    profileMissionTitle: "Misi",
    profileMissionContent: "Menghadirkan kegiatan ibadah, dakwah, sosial, dan pendidikan yang terkelola baik serta mudah diakses oleh seluruh jamaah.",
    profileFacilitiesHeading: "Fasilitas Utama Masjid",
    profileManagementBadge: "Struktur Pengurus",
    profileManagementHeading: "Pengurus Masjid Nurul Jannah",
    contactIntroBadge: "Hubungi Kami",
    contactIntroTitle: "Datang langsung ke masjid",
    contactIntroDescription: "Masjid Nurul Jannah terbuka untuk seluruh jamaah. Silakan hubungi kami melalui kontak di bawah ini.",
    contactMapButtonLabel: "Buka di Google Maps",
    pageCopy: {
      agendaTitle: "Agenda Kegiatan",
      agendaDescription: "Daftar kegiatan masjid yang dipublikasikan dari menu admin agenda.",
      pengumumanTitle: "Pengumuman",
      pengumumanDescription: "Daftar pengumuman penting untuk jamaah yang dikendalikan dari menu admin.",
      donasiTitle: "Donasi dan Dukungan Jamaah",
      donasiDescription: "Lihat campaign aktif, progres penghimpunan dana, serta informasi rekening yang dikelola pengurus masjid.",
      donasiRecentTitle: "Donasi Terbaru",
      donasiRecentDescription: "Daftar donasi terbaru untuk memberi gambaran aktivitas dukungan jamaah.",
      galeriTitle: "Galeri",
      galeriDescription: "Dokumentasi kegiatan masjid yang dikelola dari dashboard admin.",
      jadwalTitle: "Jadwal Sholat dan Petugas",
      jadwalDescription: "Informasi jadwal petugas ibadah dan kegiatan yang dapat diakses jamaah.",
      keuanganTitle: "Laporan Keuangan Ringkas",
      keuanganDescription: "Ringkasan pemasukan, pengeluaran, dan saldo kas untuk transparansi kepada jamaah.",
    },
  },
};

export async function getCmsSettings(): Promise<CmsSettingsRecord> {
  try {
    const data = await findCmsSettings();
    if (!data) return defaultCmsSettings;

    return {
      ...defaultCmsSettings,
      id: data.id,
      siteName: data.siteName,
      siteShortName: data.siteShortName,
      siteTagline: data.siteTagline,
      contactAddress: data.contactAddress,
      contactCity: data.contactCity,
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone,
      contactMapUrl: data.contactMapUrl,
      homeFeatureTitle: data.homeFeatureTitle,
      homeFeatureDescription: data.homeFeatureDescription,
      homeServiceTitle: data.homeServiceTitle,
      homeServiceDescription: data.homeServiceDescription,
      homeCtaTitle: data.homeCtaTitle,
      homeCtaDescription: data.homeCtaDescription,
      profileTitle: data.profileTitle,
      profileDescription: data.profileDescription,
      profileSidebarTitle: data.profileSidebarTitle,
      profileSidebarDescription: data.profileSidebarDescription,
      profileSidebarItems: Array.isArray(data.profileSidebarItems) ? (data.profileSidebarItems as string[]) : defaultCmsSettings.profileSidebarItems,
      profileFacilities: Array.isArray(data.profileFacilities) ? (data.profileFacilities as string[]) : defaultCmsSettings.profileFacilities,
      contactTitle: data.contactTitle,
      contactDescription: data.contactDescription,
      footerDescription: data.footerDescription,
      footerCopyright: data.footerCopyright,
      publicNav: Array.isArray(data.publicNav) ? (data.publicNav as CmsSettingsRecord["publicNav"]) : defaultCmsSettings.publicNav,
      quickLinks: Array.isArray(data.quickLinks) ? (data.quickLinks as CmsSettingsRecord["quickLinks"]) : defaultCmsSettings.quickLinks,
      contentBlocks:
        data.contentBlocks && typeof data.contentBlocks === "object"
          ? ({ ...defaultCmsSettings.contentBlocks, ...(data.contentBlocks as Record<string, unknown>) } as CmsSettingsRecord["contentBlocks"])
          : defaultCmsSettings.contentBlocks,
    };
  } catch (error) {
    console.error("Failed to load CMS settings:", error);
    return defaultCmsSettings;
  }
}

export async function saveCmsSettings(data: CmsSettingsRecord) {
  return upsertCmsSettings(data);
}
