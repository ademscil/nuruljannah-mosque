import { CalendarDays, MapPin, Star, UserRound } from "lucide-react";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { Card3D } from "@/components/shared/card-3d";
import { formatDateIndonesia } from "@/lib/format-date";
import type { EventListItem } from "@/features/events/types/event";

export function EventPublicList({ events }: { events: EventListItem[] }) {
  const list = events.filter((e) => e.isPublic && e.status === "PUBLISHED");

  if (list.length === 0) {
    return <EmptyState icon={CalendarDays} title="Belum ada agenda publik" description="Agenda yang dipublish akan tampil di sini." />;
  }

  return (
    <div className="grid gap-6 perspective-normal">
      {list.map((event, i) => (
        <Card3D
          key={event.id}
          variant="magnetic"
          delay={i * 0.08}
          className="group overflow-hidden"
        >
          {/* Top accent bar with gradient */}
          <div className="absolute left-0 right-0 top-0 h-1.5 bg-gradient-to-r from-primary via-amber-500 to-transparent opacity-80" />

          <div className="relative pt-6 pb-7 px-7">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2.5">
                  {event.isFeatured && (
                    <span className="badge-shimmer badge-amber inline-flex items-center gap-1.5">
                      <Star className="size-3" />
                      Agenda Unggulan
                    </span>
                  )}
                  <StatusBadge label="Publish" value={event.status} />
                </div>
                <h2 className="font-heading text-2xl font-semibold leading-snug tracking-tight transition-colors group-hover:text-primary">
                  {event.name}
                </h2>
                <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
                  {event.description}
                </p>
              </div>
            </div>

            <div className="mt-7 grid gap-4 sm:grid-cols-3">
              {[
                { 
                  icon: CalendarDays, 
                  label: "Jadwal", 
                  value: `${formatDateIndonesia(event.date)} · ${event.timeLabel}`,
                  iconBg: "bg-primary/10 text-primary"
                },
                { 
                  icon: MapPin, 
                  label: "Lokasi", 
                  value: event.location,
                  iconBg: "bg-amber-50 text-amber-600"
                },
                { 
                  icon: UserRound, 
                  label: "Penanggung Jawab", 
                  value: event.personInCharge,
                  iconBg: "bg-teal-50 text-teal-600"
                },
              ].map((item) => (
                <div 
                  key={item.label} 
                  className="interactive-3d group/item flex items-start gap-3 rounded-xl border border-border bg-muted/30 p-4 transition-all hover:border-primary/20 hover:bg-white"
                >
                  <div className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${item.iconBg} transition-transform duration-300 group-hover/item:scale-110`}>
                    <item.icon className="size-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">{item.label}</p>
                    <p className="mt-1.5 text-sm leading-6 font-medium text-foreground">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card3D>
      ))}
    </div>
  );
}
