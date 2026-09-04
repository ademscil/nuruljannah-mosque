import { auth } from "@/auth";
import { hasPermission } from "@/lib/role-guard";
import { type UserRole } from "@/constants/roles";
import { CalendarClock, HeartHandshake, Landmark, Megaphone, Wallet, TrendingUp, Bell, Clock, Sparkles } from "lucide-react";

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
  const session = await auth();
  const userRole = (session?.user?.role as UserRole) || "SEKRETARIS";
  const canViewFinance = hasPermission(userRole, "finance");

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
      value: canViewFinance ? formatRupiah(fin.totalIncome) : "Rp ••••••••",
      description: "Akumulasi pemasukan dari transaksi aktif.",
      trend: "up" as const,
      trendLabel: `${fin.transactionCount} transaksi`,
      icon: Landmark,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      title: "Total Pengeluaran",
      value: canViewFinance ? formatRupiah(fin.totalExpense) : "Rp ••••••••",
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

      {/* Stats Grid with 3D effect */}
      <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => <StatsCard key={s.title} {...s} />)}
      </div>

      {/* Middle row with glass morphism */}
      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        {/* Modul aktif with enhanced 3D */}
        <div className="card-3d-advanced glass-ultra rounded-3xl border border-border/50 bg-gradient-to-br from-white to-gray-50/50 p-4 sm:p-6 lg:p-8 shadow-depth-lg backdrop-blur-sm">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-gradient-to-r from-primary/10 to-transparent px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary shadow-depth-sm">
            <Sparkles className="size-3" />
            Modul Aktif
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="card-3d-advanced group animate-card-entry rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50/50 to-white p-6 shadow-depth-md transition-all hover:shadow-depth-lg">
              <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-depth-sm transition-transform duration-300 group-hover:scale-110 group-hover:shadow-depth-md">
                <Landmark className="size-6" />
              </div>
              <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-emerald-600">Keuangan</p>
              <p className="mt-2 text-2xl font-bold text-emerald-900">Saldo {formatRupiah(fin.balance)}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Dihitung dari seluruh transaksi pemasukan dan pengeluaran.</p>
            </div>
            <div className="card-3d-advanced group animate-card-entry rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50/50 to-white p-6 shadow-depth-md transition-all delay-100 hover:shadow-depth-lg">
              <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-depth-sm transition-transform duration-300 group-hover:scale-110 group-hover:shadow-depth-md">
                <HeartHandshake className="size-6" />
              </div>
              <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-amber-600">Donasi</p>
              <p className="mt-2 text-2xl font-bold text-amber-900">{campaigns.length} Campaign</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Campaign donasi, target dana, dan verifikasi donatur.</p>
            </div>
          </div>
        </div>

        {/* Pengumuman aktif with glass effect */}
        <div className="card-3d-advanced glass-ultra rounded-3xl border border-border/50 bg-gradient-to-br from-white to-gray-50/50 p-4 sm:p-6 lg:p-8 shadow-depth-lg backdrop-blur-sm">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-gradient-to-r from-blue-50 to-transparent px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-600 shadow-depth-sm">
            <Bell className="size-3" />
            Pengumuman Aktif
          </div>
          <div className="space-y-3">
            {published.length > 0 ? published.slice(0, 3).map((item) => (
              <div key={item.id} className="card-3d-advanced group rounded-xl border border-border/50 bg-white/80 p-4 shadow-depth-sm backdrop-blur-sm transition-all hover:border-primary/30 hover:shadow-depth-md">
                <p className="font-semibold leading-snug group-hover:text-primary">{item.title}</p>
                <p className="mt-1.5 flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 font-medium text-primary">{item.category}</span>
                  <span>·</span>
                  <span>{item.publishedAt ? formatDateIndonesia(item.publishedAt) : "—"}</span>
                </p>
              </div>
            )) : (
              <EmptyState title="Belum ada pengumuman aktif" description="Pengumuman yang dipublish akan muncul di sini." />
            )}
          </div>
        </div>
      </div>

      {/* Bottom row with 3D cards */}
      <div className="grid gap-6 xl:grid-cols-2">
        {/* Agenda with modern styling */}
        <div className="card-3d-advanced glass-ultra rounded-3xl border border-border/50 bg-gradient-to-br from-white to-gray-50/50 p-4 sm:p-6 lg:p-8 shadow-depth-lg backdrop-blur-sm">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-gradient-to-r from-primary/10 to-transparent px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary shadow-depth-sm">
            <CalendarClock className="size-3" />
            Agenda Terdekat
          </div>
          <div className="space-y-3">
            {upcoming.length > 0 ? upcoming.map((item) => (
              <div key={item.id} className="card-3d-advanced group flex items-start gap-4 rounded-xl border border-border/50 bg-white/80 p-4 shadow-depth-sm backdrop-blur-sm transition-all hover:border-primary/30 hover:shadow-depth-md">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 text-white shadow-depth-sm">
                  <CalendarClock className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold group-hover:text-primary">{item.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{formatDateIndonesia(item.date)} · {item.location}</p>
                </div>
              </div>
            )) : (
              <EmptyState title="Belum ada agenda terdekat" description="Agenda yang dipublish akan tampil di panel ini." />
            )}
          </div>
        </div>

        {/* Jadwal petugas with amber theme */}
        <div className="card-3d-advanced glass-ultra rounded-3xl border border-border/50 bg-gradient-to-br from-white to-gray-50/50 p-4 sm:p-6 lg:p-8 shadow-depth-lg backdrop-blur-sm">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-gradient-to-r from-amber-50 to-transparent px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-amber-600 shadow-depth-sm">
            <Clock className="size-3" />
            Jadwal Petugas
          </div>
          <div className="space-y-3">
            {todaySched.length > 0 ? todaySched.map((item) => (
              <div key={item.id} className="card-3d-advanced group flex items-start gap-4 rounded-xl border border-border/50 bg-white/80 p-4 shadow-depth-sm backdrop-blur-sm transition-all hover:border-amber-300 hover:shadow-depth-md">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-depth-sm">
                  <Clock className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold group-hover:text-amber-600">{item.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{item.personName} · {item.timeLabel}</p>
                </div>
              </div>
            )) : (
              <EmptyState title="Belum ada jadwal petugas" description="Jadwal yang dibuat pengurus akan tampil di panel ini." />
            )}
          </div>
        </div>
      </div>

      {/* Activity feed with enhanced styling */}
      <div className="space-y-5">
        <SectionHeader title="Aktivitas Terbaru" description="Ringkasan pembaruan modul yang paling sering dipantau pengurus." />
        <div className="card-3d-advanced glass-ultra rounded-3xl border border-border/50 bg-gradient-to-br from-white to-gray-50/50 p-4 sm:p-6 lg:p-8 shadow-depth-lg backdrop-blur-sm">
          <div className="space-y-3">
            {[
              { icon: Landmark, text: `Bendahara memperbarui ${transactions[0]?.description ?? "data transaksi kas"}.`, color: "from-emerald-500 to-emerald-600", bgColor: "bg-emerald-50/50" },
              { icon: Megaphone, text: `Sekretaris mengelola ${published[0]?.title ?? "pengumuman terbaru"}.`, color: "from-amber-500 to-amber-600", bgColor: "bg-amber-50/50" },
              { icon: TrendingUp, text: `Koordinator menjadwalkan ${todaySched[0]?.title ?? "petugas ibadah"}.`, color: "from-primary to-primary/80", bgColor: "bg-primary/5" },
            ].map((item, i) => (
              <div key={i} className={`card-3d-advanced group flex items-center gap-4 rounded-xl border border-border/40 ${item.bgColor} p-4 shadow-depth-sm backdrop-blur-sm transition-all hover:border-border hover:shadow-depth-md`}>
                <div className={`flex size-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${item.color} text-white shadow-depth-sm transition-transform group-hover:scale-110`}>
                  <item.icon className="size-5" />
                </div>
                <p className="text-sm font-medium">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
