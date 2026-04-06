import { Landmark, QrCode, WalletCards, Target } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { formatRupiah } from "@/lib/format-rupiah";
import type { DonationCampaignItem } from "@/features/donations/types/donation";

export function DonationCampaignGrid({ campaigns }: { campaigns: DonationCampaignItem[] }) {
  if (campaigns.length === 0) {
    return <EmptyState icon={WalletCards} title="Belum ada campaign donasi" description="Campaign donasi akan tampil setelah dibuat oleh pengurus." />;
  }

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      {campaigns.map((c, i) => (
        <article
          key={c.id}
          style={{ animationDelay: `${i * 80}ms` }}
          className="animate-fade-up card-hero overflow-hidden transition-all duration-300 hover:-translate-y-0.5"
        >
          {/* Status bar */}
          <div className={`h-1.5 w-full ${c.isActive ? "bg-gradient-to-r from-primary to-primary/40" : "bg-muted"}`} />

          <div className="p-8">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className={c.isActive ? "badge-primary" : "badge-amber"}>
                  {c.isActive ? "Campaign Aktif" : "Campaign Selesai"}
                </div>
                <h3 className="mt-3 font-heading text-2xl font-semibold leading-snug">{c.title}</h3>
              </div>
              <div className="rounded-full border border-border bg-muted/50 px-3 py-1.5 text-xs font-bold text-foreground">
                {c.progress}%
              </div>
            </div>

            <p className="mt-4 text-sm leading-7 text-muted-foreground">{c.description}</p>

            {/* Progress */}
            <div className="mt-6 space-y-2.5">
              <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-700"
                  style={{ width: `${Math.min(c.progress, 100)}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-primary">{formatRupiah(c.collectedAmount)}</span>
                <span className="text-muted-foreground">Target {formatRupiah(c.targetAmount)}</span>
              </div>
            </div>

            {/* Info grid */}
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                { icon: Landmark, label: "Rekening", value: c.bankAccountName ?? "—", sub: c.bankAccountNumber ?? "—" },
                { icon: WalletCards, label: "Donatur", value: `${c.donationCount} transaksi`, sub: "Tersinkron ke admin" },
                { icon: QrCode, label: "QRIS", value: c.qrisImageUrl ? "Tersedia" : "Belum tersedia", sub: "Dapat dilengkapi admin" },
              ].map((item) => (
                <div key={item.label} className="rounded-xl border border-border bg-muted/30 p-4">
                  <item.icon className="size-4 text-primary" />
                  <p className="mt-2.5 text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">{item.label}</p>
                  <p className="mt-1.5 text-sm font-semibold">{item.value}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
