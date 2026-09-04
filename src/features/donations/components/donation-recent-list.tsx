import { Heart, Sparkles } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { formatDateIndonesia } from "@/lib/format-date";
import { formatRupiah } from "@/lib/format-rupiah";
import type { DonationListItem } from "@/features/donations/types/donation";

type DonationRecentListProps = {
  donations: DonationListItem[];
  title: string;
  description: string;
};

export function DonationRecentList({
  donations,
  title,
  description,
}: DonationRecentListProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-br from-background via-background to-muted/20 shadow-depth-lg backdrop-blur-sm">
      {/* Decorative gradient overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-rose-500/5" />

      <div className="relative space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-rose-500/20">
            <Sparkles className="size-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold tracking-tight text-foreground">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>

        {/* Content */}
        {donations.length === 0 ? (
          <div className="rounded-2xl border border-border/50 bg-card/30 p-4 sm:p-6 lg:p-8 backdrop-blur-sm">
            <EmptyState
              icon={Heart}
              title="Belum ada donasi"
              description="Donasi yang masuk akan tampil di sini"
            />
          </div>
        ) : (
          <div className="space-y-3">
            {donations.slice(0, 5).map((item) => (
              <div
                key={item.id}
                className="group flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border/50 bg-card/30 px-5 py-4 backdrop-blur-sm transition-all duration-300 hover:border-amber-500/30 hover:bg-card/50 hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-rose-500/20 transition-transform duration-300 group-hover:scale-110">
                    <Heart className="size-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      {item.donorName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {item.campaignTitle} · {formatDateIndonesia(item.donatedAt)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-amber-600 dark:text-amber-400">
                    {formatRupiah(item.amount)}
                  </p>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">
                    {item.status === "CONFIRMED"
                      ? "Terkonfirmasi"
                      : item.status === "PENDING"
                        ? "Menunggu"
                        : "Dibatalkan"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
