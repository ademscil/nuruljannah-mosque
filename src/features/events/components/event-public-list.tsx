import { CalendarDays, MapPin, Star, UserRound } from "lucide-react";

import { StatusBadge } from "@/components/shared/status-badge";
import { formatDateIndonesia } from "@/lib/format-date";
import type { EventListItem } from "@/features/events/types/event";

type EventPublicListProps = {
  events: EventListItem[];
};

export function EventPublicList({ events }: EventPublicListProps) {
  const publicEvents = events.filter(
    (event) => event.isPublic && event.status === "PUBLISHED",
  );

  return (
    <div className="grid gap-5">
      {publicEvents.map((event) => (
        <article
          key={event.id}
          className="rounded-[2rem] border border-border/70 bg-card p-6 shadow-sm"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                {event.isFeatured ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                    <Star className="size-3.5" />
                    Agenda Unggulan
                  </span>
                ) : null}
                <StatusBadge label="Publish" value={event.status} />
              </div>
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">
                  {event.name}
                </h2>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
                  {event.description}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl bg-muted/40 p-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <CalendarDays className="size-4 text-emerald-700 dark:text-emerald-300" />
                Jadwal
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {formatDateIndonesia(event.date)} • {event.timeLabel}
              </p>
            </div>
            <div className="rounded-2xl bg-muted/40 p-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <MapPin className="size-4 text-emerald-700 dark:text-emerald-300" />
                Lokasi
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{event.location}</p>
            </div>
            <div className="rounded-2xl bg-muted/40 p-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <UserRound className="size-4 text-emerald-700 dark:text-emerald-300" />
                Penanggung Jawab
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {event.personInCharge}
              </p>
            </div>
          </div>
        </article>
      ))}

      {publicEvents.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
          Belum ada agenda publik yang dipublish.
        </div>
      ) : null}
    </div>
  );
}
