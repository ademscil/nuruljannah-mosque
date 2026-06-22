import {
  DonationStatus,
  EventStatus,
  PrismaClient,
  PublishStatus,
  ScheduleRole,
  TransactionType,
  UserRole,
} from "@prisma/client";
import { hash } from "bcryptjs";

import { slugify } from "../src/lib/slugify";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await hash("Admin123!", 10);

  const roles = await Promise.all(
    [
      UserRole.ADMIN_UTAMA,
      UserRole.BENDAHARA,
      UserRole.SEKRETARIS,
      UserRole.KOORDINATOR_KEGIATAN,
      UserRole.JAMAAH_UMUM,
    ].map((name) =>
      prisma.role.upsert({
        where: { name },
        update: {},
        create: { name },
      }),
    ),
  );

  const roleMap = Object.fromEntries(roles.map((role) => [role.name, role]));

  const admin = await prisma.user.upsert({
    where: { email: "admin@nuruljannah.id" },
    update: {
      name: "Ahmad Fauzi",
      passwordHash,
      roleId: roleMap.ADMIN_UTAMA.id,
    },
    create: {
      name: "Ahmad Fauzi",
      email: "admin@nuruljannah.id",
      phone: "081234567890",
      passwordHash,
      roleId: roleMap.ADMIN_UTAMA.id,
    },
  });

  await prisma.user.upsert({
    where: { email: "bendahara@nuruljannah.id" },
    update: {
      name: "Nur Aini",
      passwordHash,
      roleId: roleMap.BENDAHARA.id,
    },
    create: {
      name: "Nur Aini",
      email: "bendahara@nuruljannah.id",
      phone: "081245678901",
      passwordHash,
      roleId: roleMap.BENDAHARA.id,
    },
  });

  await prisma.user.upsert({
    where: { email: "sekretaris@nuruljannah.id" },
    update: {
      name: "Rizky Hidayat",
      passwordHash,
      roleId: roleMap.SEKRETARIS.id,
    },
    create: {
      name: "Rizky Hidayat",
      email: "sekretaris@nuruljannah.id",
      phone: "081256789012",
      passwordHash,
      roleId: roleMap.SEKRETARIS.id,
    },
  });

  await prisma.announcement.upsert({
    where: { slug: "kajian-tafsir-ahad-pagi" },
    update: {},
    create: {
      title: "Kajian Tafsir Ahad Pagi",
      slug: "kajian-tafsir-ahad-pagi",
      content:
        "InsyaAllah kajian tafsir Ahad pagi akan dilaksanakan setelah sholat Subuh berjamaah di aula utama masjid.",
      category: "Kajian",
      status: PublishStatus.PUBLISHED,
      publishedAt: new Date("2026-04-05T06:00:00+07:00"),
      createdById: admin.id,
    },
  });

  await prisma.event.upsert({
    where: { slug: slugify("Buka Puasa Bersama Jamaah") },
    update: {},
    create: {
      name: "Buka Puasa Bersama Jamaah",
      slug: slugify("Buka Puasa Bersama Jamaah"),
      description:
        "Program buka puasa bersama jamaah dan santunan anak yatim di aula serbaguna masjid.",
      date: new Date("2026-04-10T17:00:00+07:00"),
      timeLabel: "17.00 WIB",
      location: "Aula Serbaguna",
      personInCharge: "Rizky Hidayat",
      status: EventStatus.PUBLISHED,
      isPublic: true,
      isFeatured: true,
      publishedAt: new Date("2026-04-03T09:00:00+07:00"),
      createdById: admin.id,
    },
  });

  await prisma.transaction.createMany({
    data: [
      {
        type: TransactionType.INCOME,
        category: "Donasi Jum'at",
        amount: 6250000,
        transactionAt: new Date("2026-04-01T09:00:00+07:00"),
        description: "Pemasukan kotak amal Jum'at pekan pertama.",
        createdById: admin.id,
      },
      {
        type: TransactionType.EXPENSE,
        category: "Operasional Listrik",
        amount: 1450000,
        transactionAt: new Date("2026-04-02T10:00:00+07:00"),
        description: "Pembayaran listrik dan air bulan April.",
        createdById: admin.id,
      },
    ],
  });

  const campaign = await prisma.donationCampaign.upsert({
    where: { slug: "renovasi-tempat-wudhu" },
    update: {
      collectedAmount: 21500000,
      isActive: true,
    },
    create: {
      title: "Renovasi Tempat Wudhu",
      slug: "renovasi-tempat-wudhu",
      description:
        "Penggalangan dana untuk renovasi area tempat wudhu agar lebih nyaman dan aman bagi jamaah.",
      targetAmount: 50000000,
      collectedAmount: 21500000,
      bankAccountName: "Masjid Nurul Jannah",
      bankAccountNumber: "1234567890",
      isActive: true,
      createdById: admin.id,
    },
  });

  await prisma.donation.create({
    data: {
      donorName: "Ibu Siti Rahmah",
      donorPhone: "081298765432",
      amount: 1500000,
      status: DonationStatus.CONFIRMED,
      donatedAt: new Date("2026-04-02T14:00:00+07:00"),
      campaignId: campaign.id,
      recordedById: admin.id,
    },
  });

  await prisma.managementMember.createMany({
    data: [
      {
        name: "Ahmad Fauzi",
        position: "Ketua DKM",
        phone: "081234567890",
        email: "admin@nuruljannah.id",
        termPeriod: "2025 - 2028",
        status: PublishStatus.PUBLISHED,
        createdById: admin.id,
      },
      {
        name: "Nur Aini",
        position: "Bendahara",
        phone: "081245678901",
        email: "bendahara@nuruljannah.id",
        termPeriod: "2025 - 2028",
        status: PublishStatus.PUBLISHED,
        createdById: admin.id,
      },
    ],
  });

  await prisma.galleryItem.create({
    data: {
      title: "Pesantren Kilat Remaja",
      category: "Pendidikan",
      imageUrl: "https://images.unsplash.com/photo-1519677100203-a0e668c92439",
      activityDate: new Date("2026-03-24T08:00:00+07:00"),
      status: PublishStatus.PUBLISHED,
      createdById: admin.id,
    },
  });

  await prisma.schedule.create({
    data: {
      title: "Sholat Jum'at",
      roleType: ScheduleRole.KHATIB,
      scheduleFor: new Date("2026-04-03T12:00:00+07:00"),
      timeLabel: "12.00 WIB",
      personName: "KH. Abdul Malik",
      createdById: admin.id,
    },
  });

  await prisma.homepageContent.create({
    data: {
      heroTitle: "Masjid Nurul Jannah, pusat ibadah dan pemberdayaan umat.",
      heroSubtitle:
        "Informasi jamaah, agenda kegiatan, donasi, dan pengelolaan konten internal dalam satu platform modern.",
      heroPrimaryCtaLabel: "Lihat Agenda Terbaru",
      heroPrimaryCtaHref: "/agenda-kegiatan",
      welcomeTitle: "Sambutan Pengurus",
      welcomeContent:
        "Kami menghadirkan portal ini agar informasi masjid lebih tertata, transparan, dan mudah diakses oleh jamaah maupun pengurus.",
      donationCtaTitle: "Dukung Program Renovasi Tempat Wudhu",
      donationCtaDescription:
        "Salurkan donasi terbaik Anda untuk mendukung fasilitas ibadah yang lebih nyaman.",
      status: PublishStatus.PUBLISHED,
      createdById: admin.id,
    },
  });

  await prisma.cmsSettings.upsert({
    where: { id: "default-cms-settings" },
    update: {},
    create: {
      id: "default-cms-settings",
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
        { label: "Profil", href: "/profil" },
        { label: "Jadwal Sholat", href: "/jadwal-sholat" },
        { label: "Agenda", href: "/agenda-kegiatan" },
        { label: "Pengumuman", href: "/pengumuman" },
        { label: "Donasi", href: "/donasi" },
        { label: "Laporan Keuangan", href: "/laporan-keuangan" },
        { label: "Galeri", href: "/galeri" },
        { label: "Kontak", href: "/kontak" },
      ],
      quickLinks: [
        {
          title: "Lihat Agenda Kegiatan",
          description: "Tampilkan jadwal kegiatan masjid yang akan datang.",
          href: "/agenda-kegiatan",
        },
        {
          title: "Buka Pengumuman",
          description: "Baca informasi terbaru yang dipublikasikan pengurus.",
          href: "/pengumuman",
        },
        {
          title: "Masuk Dashboard Admin",
          description: "Kelola konten publik dan data operasional dari CMS internal.",
          href: "/cms",
        },
      ],
      contentBlocks: {
        heroVideoUrl:
          "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        heroBadge: "Website Resmi Masjid Nurul Jannah",
        heroEyebrow: "Pusat Informasi Jamaah dan Pengurus",
        heroSecondaryButtonLabel: "Lihat Lokasi",
        stats: [
          { label: "Agenda Aktif", value: "4+" },
          { label: "Informasi Publik", value: "Terpusat" },
          { label: "CMS Pengurus", value: "Siap Pakai" },
        ],
        features: [
          {
            title: "Agenda dan Kajian",
            description:
              "Jamaah dapat melihat agenda kegiatan, kajian, dan program masjid dengan tampilan yang jelas dan mudah dipahami.",
          },
          {
            title: "Pengumuman Resmi",
            description:
              "Pengurus mempublikasikan informasi penting secara tertata langsung dari dashboard internal.",
          },
          {
            title: "Donasi dan Keuangan",
            description:
              "Area donasi dan ringkasan keuangan tersedia untuk transparansi penuh kepada seluruh jamaah.",
          },
          {
            title: "Operasional Pengurus",
            description:
              "Role pengurus, jadwal petugas, dan CMS internal terkelola dari dashboard yang rapi dan efisien.",
          },
        ],
        services: [
          {
            title: "Jadwal Terpusat",
            description: "Jadwal ibadah dan petugas lebih cepat diakses dari satu tempat.",
          },
          {
            title: "Donasi Transparan",
            description:
              "Campaign, donatur, dan progres penghimpunan dana dipantau dari satu modul.",
          },
          {
            title: "Alamat Resmi",
            description: "Lokasi masjid di Pangkal Pinang terhubung langsung ke Google Maps.",
          },
        ],
        quickLinksSectionTitle: "Akses Cepat",
        quickLinksSectionBadge: "Akses Cepat",
        ctaBadge: "Bergabung Bersama Kami",
        ctaPrimaryButtonLabel: "Lihat Agenda",
        ctaSecondaryButtonLabel: "Donasi Sekarang",
      },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
