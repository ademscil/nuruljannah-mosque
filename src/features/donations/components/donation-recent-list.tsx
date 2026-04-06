import { Heart } from "lucide-react";
import { formatDateIndonesia } from "@/lib/format-date";
import { formatRupiah } from "@/lib/format-rupiah";
import { EmptyState } from "@/components/shared/empty-state";
import type { DonationListItem } from "@/features/donations/types/donation";

type Props = { donations: DonationListItem[]; title: string; description: string };

export function DonationRecentList({ donations, title, description }: Props) {
  return (
    <div className="card-hero p-8">
      <div className="badge-amber mb-4">
        <Heart className="size-3" />
        {title}
      </div>
      <p className="max-w-2xl text-sm leading-7 text-muted-foreground">{description}</p>

      {donations.length === 0 ? (
        <div className="mt-6">
          <EmptyState title="Belum ada donasi" description="Donasi yang masuk akan tampil di sini." />
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {donations.slice(0, 5).map((item, i) => (
            <div
              key={item.id}
              style={{ animationDelay: `${i * 50}ms` }}
              className="animate-fade-up flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-muted/30 px-5 py-4 transition-colors hover:bg-white"
            >
              <div>
                <p className="font-semibold">{item.donorName}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {item.campaignTitle} · {formatDateIndonesia(item.donatedAt)}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-primary">{formatRupiah(item.amount)}</p>
                <p className="mt-0.5 text-xs uppercase tracking-[0.14em] text-muted-foreground">{item.status}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
