import { CalendarClock, HeartHandshake, Landmark, Megaphone, Wallet, TrendingUp, Bell, Clock } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { SectionHeader } from "@/components/shared/section-header";
import { StatsCard } from "@/components/shared/stats-card";
import { getAnnouncements } from "@/features/announcements/services/announcement-service";
import { getDonationCampaigns, getDonations, getDonationSummary } from "@/features/donations/services/donation-service";
import { getEvents } from "@/features/events/services/event-service";
import { getFinanceSummary, getTransactions } from "@/features/finance/services/transaction-service";
import { getSchedules } from "@/features/schedules/services/schedule-service";
import { formatDateIndonesia } from "@/lib/format-date";
import { formatRupiah } from "@/lib/format-rupiah";

export async function DashboardOverview() {
  const [transactions, announcements, events, schedules, campaigns, donations] = await Promise.all([
    getTransactions(), getAnnouncements(), getEvents(),
    getSchedules(), getDonationCampaigns(), getDonations(),
  ]);

  const fin = getFinanceSummary(transactions);
  const don = getDonationSummary(campaigns, donations);
  const published = announcements.filter((a) => a.status === "PUBLISHED");
  const upcoming = events.filter((e) => e.status === "PUBLISHED").slice(0, 3);
  const todaySched = schedules.slice(0, 3);

  const stats = [
    {
      title: "Total Pemasukan",
      value: formatRupiah(fin.totalIncome),
      description: "Akumulasi pemasukan dari transaksi aktif.",
      trend: "up" as const,
      trendLabel: `${fin.transactionCount} transaksi`,
      icon: Landmark,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      title: "Total Pengeluaran",
      value: formatRupiah(fin.totalExpense),
      description: "Belanja operasional dan pengeluaran program.",
      trend: "down" as const,
      trendLabel: "Tercatat di modul keuangan",
      icon: Wallet,
      iconBg: "bg-rose-50",
      iconColor: "text-rose-600",
    },
    {
      title: "Agenda Terdekat",
      value: `${upcoming.length} Agenda`,
      description: "Kegiatan yang sedang atau akan dipublikasikan.",
      trend: "up" as const,
      trendLabel: "Sinkron dengan CMS agenda",
      icon: CalendarClock,
      iconBg: "bg-primary/8",
      iconColor: "text-primary",
    },
    {
      title: "Donatur Aktif",
      value: `${don.donorCount} Orang`,
      description: "Donatur dengan transaksi terkonfirmasi.",
      trend: "up" as const,
      trendLabel: `${don.activeCampaignCount} campaign aktif`,
      icon: HeartHandshake,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Dashboard"
        title="Ringkasan Operasional"
        description="Ringkasan keuangan, aktivitas modul, jadwal petugas, dan konten publik yang sedang aktif."
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => <StatsCard key={s.title} {...s} />)}
      </div>

      {/* Middle row */}
      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        {/* Modul aktif */}
        <div className="card-hero p-7">
          <div className="badge-primary mb-5">Modul Aktif</div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="card-base group p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition-transform duration-300 group-hover:scale-110">
                <Landmark className="size-5" />
              </div>
              <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-primary">Keuangan</p>
              <p className="mt-1.5 text-lg font-bold">Saldo {formatRupiah(fin.balance)}</p>
              <p className="mt-1 text-sm text-muted-foreground">Dihitung dari seluruh transaksi pemasukan dan pengeluaran.</p>
            </div>
            <div className="card-base group p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex size-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 transition-transform duration-300 group-hover:scale-110">
                <HeartHandshake className="size-5" />
              </div>
              <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-primary">Donasi</p>
              <p className="mt-1.5 text-lg font-bold">{campaigns.length} Campaign</p>
              <p className="mt-1 text-sm text-muted-foreground">Campaign donasi, target dana, dan verifikasi donatur.</p>
            </div>
          </div>
        </div>

        {/* Pengumuman aktif */}
        <div className="card-hero p-7">
          <div className="flex items-center gap-2 mb-5">
            <div className="badge-primary">
              <Bell className="size-3" />
              Pengumuman Aktif
            </div>
          </div>
          <div className="space-y-3">
            {published.length > 0 ? published.slice(0, 3).map((item) => (
              <div key={item.id} className="rounded-xl border border-border bg-muted/30 p-4 transition-colors hover:bg-white">
                <p className="text-sm font-semibold leading-snug">{item.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {item.category} · {item.publishedAt ? formatDateIndonesia(item.publishedAt) : "—"}
                </p>
              </div>
            )) : (
              <EmptyState title="Belum ada pengumuman aktif" description="Pengumuman yang dipublish akan muncul di sini." />
            )}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid gap-6 xl:grid-cols-2">
        {/* Agenda */}
        <div className="card-hero p-7">
          <div className="badge-primary mb-5">
            <CalendarClock className="size-3" />
            Agenda Terdekat
          </div>
          <div className="space-y-3">
            {upcoming.length > 0 ? upcoming.map((item) => (
              <div key={item.id} className="flex items-start gap-3 rounded-xl border border-border bg-muted/30 p-4 transition-colors hover:bg-white">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/8 text-primary">
                  <CalendarClock className="size-4" />
                </div>
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{formatDateIndonesia(item.date)} · {item.location}</p>
                </div>
              </div>
            )) : (
              <EmptyState title="Belum ada agenda terdekat" description="Agenda yang dipublish akan tampil di panel ini." />
            )}
          </div>
        </div>

        {/* Jadwal petugas */}
        <div className="card-hero p-7">
          <div className="badge-amber mb-5">
            <Clock className="size-3" />
            Jadwal Petugas
          </div>
          <div className="space-y-3">
            {todaySched.length > 0 ? todaySched.map((item) => (
              <div key={item.id} className="flex items-start gap-3 rounded-xl border border-border bg-muted/30 p-4 transition-colors hover:bg-white">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                  <Clock className="size-4" />
                </div>
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{item.personName} · {item.timeLabel}</p>
                </div>
              </div>
            )) : (
              <EmptyState title="Belum ada jadwal petugas" description="Jadwal yang dibuat pengurus akan tampil di panel ini." />
            )}
          </div>
        </div>
      </div>

      {/* Activity feed */}
      <div className="space-y-4">
        <SectionHeader title="Aktivitas Terbaru" description="Ringkasan pembaruan modul yang paling sering dipantau pengurus." />
        <div className="card-hero p-7">
          <div className="space-y-3">
            {[
              { icon: Landmark, text: `Bendahara memperbarui ${transactions[0]?.description ?? "data transaksi kas"}.`, color: "bg-emerald-50 text-emerald-600" },
              { icon: Megaphone, text: `Sekretaris mengelola ${published[0]?.title ?? "pengumuman terbaru"}.`, color: "bg-amber-50 text-amber-600" },
              { icon: TrendingUp, text: `Koordinator menjadwalkan ${todaySched[0]?.title ?? "petugas ibadah"}.`, color: "bg-primary/8 text-primary" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl border border-border/60 bg-muted/20 px-4 py-3 transition-colors hover:bg-white">
                <div className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${item.color}`}>
                  <item.icon className="size-4" />
                </div>
                <p className="text-sm">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
