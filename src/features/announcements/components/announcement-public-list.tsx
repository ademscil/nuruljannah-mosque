import { Megaphone, Tag, Bell } from "lucide-react";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { Card3D } from "@/components/shared/card-3d";
import { formatDateIndonesia } from "@/lib/format-date";
import type { AnnouncementListItem } from "@/features/announcements/types/announcement";

export function AnnouncementPublicList({ announcements }: { announcements: AnnouncementListItem[] }) {
  const list = announcements.filter((a) => a.status === "PUBLISHED");

  if (list.length === 0) {
    return <EmptyState icon={Megaphone} title="Belum ada pengumuman" description="Pengumuman yang dipublish akan tampil di sini." />;
  }

  return (
    <div className="grid gap-6 perspective-normal">
      {list.map((item, i) => (
        <Card3D
          key={item.id}
          variant="magnetic"
          delay={i * 0.08}
          className="group overflow-hidden"
        >
          {/* Top accent bar with animated gradient */}
          <div className="absolute left-0 right-0 top-0 h-1.5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300/40 opacity-90" />
          
          <div className="relative pt-6 pb-7 px-7">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="badge-shimmer inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-amber-700">
                    <Tag className="size-3" />
                    {item.category}
                  </span>
                  <StatusBadge label="Publish" value={item.status} />
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 transition-transform duration-300 group-hover:scale-110">
                    <Bell className="size-5" />
                  </div>
                  <div className="flex-1">
                    <h2 className="font-heading text-xl font-semibold leading-snug tracking-tight transition-colors group-hover:text-primary">
                      {item.title}
                    </h2>
                    <p className="mt-1.5 text-xs font-medium text-muted-foreground">
                      {item.publishedAt ? formatDateIndonesia(item.publishedAt) : "Belum dipublish"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-5 rounded-xl border border-border bg-muted/20 p-4">
              <p className="text-sm leading-7 text-muted-foreground">{item.content}</p>
            </div>
          </div>
        </Card3D>
      ))}
    </div>
  );
}
