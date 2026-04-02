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
