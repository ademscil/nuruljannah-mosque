import {
  CalendarClock,
  HeartHandshake,
  Landmark,
  Megaphone,
  Wallet,
} from "lucide-react";

import { ContentPreviewCard } from "@/components/shared/content-preview-card";
import { PageHeader } from "@/components/shared/page-header";
import { SectionHeader } from "@/components/shared/section-header";
import { StatsCard } from "@/components/shared/stats-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const stats = [
  {
    title: "Total Pemasukan",
    value: "Rp 18.450.000",
    description: "Akumulasi transaksi masuk bulan ini.",
    trend: "up" as const,
    trendLabel: "+12,5% dari bulan lalu",
    icon: Landmark,
  },
  {
    title: "Total Pengeluaran",
    value: "Rp 7.280.000",
    description: "Belanja operasional dan program kegiatan.",
    trend: "down" as const,
    trendLabel: "-3,2% dari bulan lalu",
    icon: Wallet,
  },
  {
    title: "Agenda Terdekat",
    value: "4 Agenda",
    description: "Agenda aktif dalam 14 hari ke depan.",
    trend: "up" as const,
    trendLabel: "2 agenda unggulan",
    icon: CalendarClock,
  },
  {
    title: "Donatur Aktif",
    value: "38 Orang",
    description: "Donatur unik pada campaign aktif.",
    trend: "up" as const,
    trendLabel: "+9 donatur baru",
    icon: HeartHandshake,
  },
];

export function DashboardOverview() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Dashboard"
        title="Ringkasan operasional Masjid Nurul Jannah"
        description="Fondasi dashboard admin sudah siap dengan struktur widget, statistik, dan placeholder data yang akan dihubungkan ke Prisma + Supabase pada tahap fitur berikutnya."
      />

      <div className="grid gap-4 xl:grid-cols-4">
        {stats.map((item) => (
          <StatsCard key={item.title} {...item} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="rounded-[2rem] border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle>Persiapan modul dashboard</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <ContentPreviewCard
              eyebrow="Tahap Berikutnya"
              title="Grafik Pemasukan vs Pengeluaran"
              description="Slot grafik Recharts sudah disiapkan untuk diisi data transaksi bulanan dari Prisma."
            />
            <ContentPreviewCard
              eyebrow="Tahap Berikutnya"
              title="Aktivitas Terbaru"
              description="Panel recent activities akan menarik perubahan konten dari pengumuman, agenda, keuangan, donasi, dan galeri."
            />
          </CardContent>
        </Card>
        <Card className="rounded-[2rem] border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle>Pengumuman aktif</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              "Santunan Ramadhan 1447 H",
              "Kerja Bakti Akhir Pekan",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-border bg-muted/40 p-4"
              >
                <p className="text-sm font-semibold">{item}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Konten ini nanti akan tersinkron dengan CMS internal.
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <SectionHeader
          title="Recent activities"
          description="Placeholder aktivitas disiapkan untuk audit log internal dan update dashboard real-time."
        />
        <Card className="rounded-[2rem] border-border/60 shadow-sm">
          <CardContent className="space-y-4 p-6">
            {[
              "Sekretaris memperbarui konten hero beranda.",
              "Bendahara menambahkan transaksi pemasukan donasi Jum'at.",
              "Admin Utama mengubah status pengumuman menjadi publish.",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-2xl border border-border/60 bg-muted/30 px-4 py-3"
              >
                <Megaphone className="size-4 text-emerald-700 dark:text-emerald-300" />
                <p className="text-sm">{item}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
