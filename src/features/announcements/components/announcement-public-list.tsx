import { ContentPreviewCard } from "@/components/shared/content-preview-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatDateIndonesia } from "@/lib/format-date";
import type { AnnouncementListItem } from "@/features/announcements/types/announcement";

type AnnouncementPublicListProps = {
  announcements: AnnouncementListItem[];
};

export function AnnouncementPublicList({
  announcements,
}: AnnouncementPublicListProps) {
  return (
    <div className="grid gap-5">
      {announcements
        .filter((item) => item.status === "PUBLISHED")
        .map((item) => (
          <div
            key={item.id}
            className="rounded-[2rem] border border-border/70 bg-card p-6 shadow-sm"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-1">
                <h2 className="text-xl font-semibold tracking-tight">
                  {item.title}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {item.category} •{" "}
                  {item.publishedAt
                    ? formatDateIndonesia(item.publishedAt)
                    : "Belum dipublish"}
                </p>
              </div>
              <StatusBadge label="Publish" value={item.status} />
            </div>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              {item.content}
            </p>
          </div>
        ))}

      {announcements.length === 0 ? (
        <ContentPreviewCard
          title="Belum ada pengumuman"
          description="Pengumuman yang dipublish akan tampil di sini."
        />
      ) : null}
    </div>
  );
}
