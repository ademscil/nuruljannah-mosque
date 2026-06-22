import { Landmark, QrCode, WalletCards, TrendingUp } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { Card3D } from "@/components/shared/card-3d";
import { formatRupiah } from "@/lib/format-rupiah";
import type { DonationCampaignItem } from "@/features/donations/types/donation";

export function DonationCampaignGrid({ campaigns }: { campaigns: DonationCampaignItem[] }) {
  if (campaigns.length === 0) {
    return <EmptyState icon={WalletCards} title="Belum ada campaign donasi" description="Campaign donasi akan tampil setelah dibuat oleh pengurus." />;
  }

  return (
    <div className="grid gap-6 xl:grid-cols-2 perspective-normal">
      {campaigns.map((c, i) => (
        <Card3D
          key={c.id}
          variant="elevated"
          delay={i * 0.1}
          className="group overflow-hidden"
        >
          {/* Status bar with enhanced gradient */}
          <div className={`absolute left-0 right-0 top-0 h-2 ${
            c.isActive 
              ? "bg-gradient-to-r from-primary via-primary/70 to-primary/40" 
              : "bg-gradient-to-r from-muted via-muted/60 to-transparent"
          }`} />

          <div className="relative pt-8 pb-8 px-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex-1">
                <div className={c.isActive ? "badge-shimmer badge-primary" : "badge-amber"}>
                  {c.isActive ? "Campaign Aktif" : "Campaign Selesai"}
                </div>
                <h3 className="mt-4 font-heading text-2xl font-semibold leading-snug transition-colors group-hover:text-primary">
                  {c.title}
                </h3>
              </div>
              <div className="interactive-3d flex items-center gap-2 rounded-full border border-border bg-gradient-to-br from-primary/10 to-primary/5 px-4 py-2">
                <TrendingUp className="size-4 text-primary" />
                <span className="text-sm font-bold text-foreground">{c.progress}%</span>
              </div>
            </div>

            <p className="mt-4 text-sm leading-7 text-muted-foreground">{c.description}</p>

            {/* Enhanced Progress Bar with 3D effect */}
            <div className="mt-7 space-y-3">
              <div className="relative h-3 overflow-hidden rounded-full bg-muted shadow-inner">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary via-primary/90 to-primary/70 shadow-glow-primary transition-all duration-1000 ease-out"
                  style={{ width: `${Math.min(c.progress, 100)}%` }}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-primary">{formatRupiah(c.collectedAmount)}</span>
                <span className="text-sm text-muted-foreground">Target {formatRupiah(c.targetAmount)}</span>
              </div>
            </div>

            {/* Info grid with 3D cards */}
            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              {[
                { icon: Landmark, label: "Rekening", value: c.bankAccountName ?? "—", sub: c.bankAccountNumber ?? "—", iconBg: "bg-primary/10 text-primary" },
                { icon: WalletCards, label: "Donatur", value: `${c.donationCount} transaksi`, sub: "Tersinkron ke admin", iconBg: "bg-amber-50 text-amber-600" },
                { icon: QrCode, label: "QRIS", value: c.qrisImageUrl ? "Tersedia" : "Belum tersedia", sub: "Dapat dilengkapi admin", iconBg: "bg-teal-50 text-teal-600" },
              ].map((item) => (
                <div 
                  key={item.label} 
                  className="interactive-3d group/item rounded-xl border border-border bg-muted/30 p-4 transition-all hover:border-primary/20 hover:bg-white"
                >
                  <div className={`flex size-10 items-center justify-center rounded-xl ${item.iconBg} transition-transform duration-300 group-hover/item:scale-110`}>
                    <item.icon className="size-4" />
                  </div>
                  <p className="mt-3 text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">{item.label}</p>
                  <p className="mt-1.5 text-sm font-semibold leading-snug">{item.value}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </Card3D>
      ))}
    </div>
  );
}
