import { CalendarDays, MapPin, Star, UserRound, Clock } from "lucide-react";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { formatDateIndonesia } from "@/lib/format-date";
import type { EventListItem } from "@/features/events/types/event";

export function EventPublicList({ events }: { events: EventListItem[] }) {
  const list = events.filter((e) => e.isPublic && e.status === "PUBLISHED");

  if (list.length === 0) {
    return <EmptyState icon={CalendarDays} title="Belum ada agenda publik" description="Agenda yang dipublish akan tampil di sini." />;
  }

  return (
    <div className="grid gap-5">
      {list.map((event, i) => (
        <article
          key={event.id}
          style={{ animationDelay: `${i * 60}ms` }}
          className="animate-fade-up card-elevated group overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-16px_oklch(0.18_0.018_250_/_0.14)]"
        >
          {/* Top accent bar */}
          <div className="h-1 w-full bg-gradient-to-r from-primary via-primary/60 to-transparent" />

          <div className="p-7">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  {event.isFeatured && (
                    <span className="badge-amber">
                      <Star className="size-3" />
                      Agenda Unggulan
                    </span>
                  )}
                  <StatusBadge label="Publish" value={event.status} />
                </div>
                <h2 className="font-heading text-2xl font-semibold leading-snug tracking-tight">
                  {event.name}
                </h2>
                <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
                  {event.description}
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                { icon: CalendarDays, label: "Jadwal", value: `${formatDateIndonesia(event.date)} · ${event.timeLabel}` },
                { icon: MapPin, label: "Lokasi", value: event.location },
                { icon: UserRound, label: "Penanggung Jawab", value: event.personInCharge },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3 rounded-xl bg-muted/40 p-4">
                  <item.icon className="mt-0.5 size-4 shrink-0 text-primary" />
                  <div>
                    <p className="text-xs font-semibold text-foreground">{item.label}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
