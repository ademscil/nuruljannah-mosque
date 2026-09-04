import { Landmark, QrCode, WalletCards, TrendingUp, Sparkles } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { formatRupiah } from "@/lib/format-rupiah";
import type { DonationCampaignItem } from "@/features/donations/types/donation";

export function DonationCampaignGrid({ campaigns }: { campaigns: DonationCampaignItem[] }) {
  if (campaigns.length === 0) {
    return <EmptyState icon={WalletCards} title="Belum ada campaign donasi" description="Campaign donasi akan tampil setelah dibuat oleh pengurus." />;
  }

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      {campaigns.map((c) => (
        <div
          key={c.id}
          className="group relative overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-br from-card via-card to-card/50 shadow-depth-lg backdrop-blur-sm transition-all duration-500 hover:border-primary/30 hover:shadow-depth-xl"
        >
          {/* Decorative Gradient Overlay */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-amber-500/5 via-rose-500/5 to-purple-500/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          {/* Status Bar */}
          <div className={`absolute left-0 right-0 top-0 h-1.5 ${
            c.isActive 
              ? "bg-gradient-to-r from-primary via-primary/70 to-primary/40" 
              : "bg-gradient-to-r from-muted-foreground/50 via-muted-foreground/30 to-transparent"
          }`} />

          <div className="relative p-4 sm:p-6 lg:p-8">
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex-1">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                  c.isActive 
                    ? "bg-gradient-to-r from-primary/15 to-primary/5 text-primary border border-primary/20" 
                    : "bg-gradient-to-r from-muted/50 to-muted/20 text-muted-foreground border border-border"
                }`}>
                  <Sparkles className="size-3" />
                  {c.isActive ? "Campaign Aktif" : "Campaign Selesai"}
                </span>
                <h3 className="mt-4 font-heading text-2xl font-semibold leading-snug transition-colors duration-300 group-hover:text-primary">
                  {c.title}
                </h3>
              </div>
              
              <div className="flex items-center gap-2 rounded-full border border-primary/20 bg-gradient-to-br from-primary/15 to-primary/5 px-4 py-2 shadow-sm transition-transform duration-300 group-hover:scale-105">
                <TrendingUp className="size-4 text-primary" />
                <span className="text-sm font-bold text-primary">{c.progress}%</span>
              </div>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{c.description}</p>

            {/* Progress Bar */}
            <div className="mt-7 space-y-3">
              <div className="relative h-3 overflow-hidden rounded-full bg-muted/50 shadow-inner">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary via-primary/90 to-primary/70 shadow-lg transition-all duration-1000 ease-out"
                  style={{ width: `${Math.min(c.progress, 100)}%` }}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-primary">{formatRupiah(c.collectedAmount)}</span>
                <span className="text-sm text-muted-foreground">Target {formatRupiah(c.targetAmount)}</span>
              </div>
            </div>

            {/* Info Grid */}
            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              {[
                { icon: Landmark, label: "Rekening", value: c.bankAccountName ?? "—", sub: c.bankAccountNumber ?? "—", gradient: "from-blue-500/10 to-blue-500/5", iconGradient: "from-blue-500/20 to-blue-500/10", iconColor: "text-blue-600" },
                { icon: WalletCards, label: "Donatur", value: `${c.donationCount} transaksi`, sub: "Tersinkron ke admin", gradient: "from-amber-500/10 to-amber-500/5", iconGradient: "from-amber-500/20 to-amber-500/10", iconColor: "text-amber-600" },
                { icon: QrCode, label: "QRIS", value: c.qrisImageUrl ? "Tersedia" : "Belum tersedia", sub: "Dapat dilengkapi admin", gradient: "from-emerald-500/10 to-emerald-500/5", iconGradient: "from-emerald-500/20 to-emerald-500/10", iconColor: "text-emerald-600" },
              ].map((item) => (
                <div 
                  key={item.label} 
                  className={`group/item rounded-2xl border border-border/50 bg-gradient-to-br ${item.gradient} p-4 backdrop-blur-sm transition-all duration-300 hover:border-primary/20 hover:shadow-md`}
                >
                  <div className={`flex size-10 items-center justify-center rounded-xl bg-gradient-to-br ${item.iconGradient} shadow-sm transition-transform duration-300 group-hover/item:scale-110`}>
                    <item.icon className={`size-4 ${item.iconColor}`} />
                  </div>
                  <p className="mt-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">{item.label}</p>
                  <p className="mt-1.5 text-sm font-semibold leading-snug">{item.value}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
