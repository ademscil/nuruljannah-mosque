import { Megaphone, Tag } from "lucide-react";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { formatDateIndonesia } from "@/lib/format-date";
import type { AnnouncementListItem } from "@/features/announcements/types/announcement";

export function AnnouncementPublicList({ announcements }: { announcements: AnnouncementListItem[] }) {
  const list = announcements.filter((a) => a.status === "PUBLISHED");

  if (list.length === 0) {
    return <EmptyState icon={Megaphone} title="Belum ada pengumuman" description="Pengumuman yang dipublish akan tampil di sini." />;
  }

  return (
    <div className="grid gap-5">
      {list.map((item, i) => (
        <article
          key={item.id}
          style={{ animationDelay: `${i * 60}ms` }}
          className="animate-fade-up card-elevated group overflow-hidden transition-all duration-300 hover:-translate-y-0.5"
        >
          <div className="h-1 w-full bg-gradient-to-r from-amber-400 via-amber-300/60 to-transparent" />
          <div className="p-7">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                    <Tag className="size-3" />
                    {item.category}
                  </span>
                  <StatusBadge label="Publish" value={item.status} />
                </div>
                <h2 className="text-xl font-semibold tracking-tight">{item.title}</h2>
                <p className="text-xs text-muted-foreground">
                  {item.publishedAt ? formatDateIndonesia(item.publishedAt) : "Belum dipublish"}
                </p>
              </div>
            </div>
            <p className="mt-5 text-sm leading-7 text-muted-foreground">{item.content}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
