import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, MapPin, Share2, User, Sparkles, ArrowRight } from "lucide-react";
import { formatDateIndonesia } from "@/lib/format-date";
import { ROUTE_PATHS } from "@/constants/routes";
import type { EventListItem } from "@/features/events/types/event";

export interface FeaturedEventsSectionProps {
  events: EventListItem[];
}

export function FeaturedEventsSection({ events }: FeaturedEventsSectionProps) {
  const publishedEvents = events
    .filter((e) => e.status === "PUBLISHED" && e.isPublic)
    .slice(0, 3);

  if (publishedEvents.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
            <Sparkles className="size-3.5" />
            Agenda & Kajian Mendatang
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Mari Makmurkan Majelis Ilmu
          </h2>
          <p className="text-sm text-muted-foreground">
            Ikuti kajian rutin, tabligh akbar, dan kegiatan pembinaan jamaah di Masjid Nurul Jannah.
          </p>
        </div>

        <Link
          href={ROUTE_PATHS.events}
          className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:underline"
        >
          Lihat Semua Agenda
          <ArrowRight className="size-4" />
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {publishedEvents.map((item) => {
          const shareText = encodeURIComponent(
            `*${item.name}*\n🗓️ ${formatDateIndonesia(item.date)} (${item.timeLabel})\n📍 ${item.location}\n🎙️ Bersama: ${item.personInCharge}\n\nMari hadir memakmurkan Masjid Nurul Jannah!`
          );
          const waUrl = `https://wa.me/?text=${shareText}`;

          return (
            <div
              key={item.id}
              className="group flex flex-col overflow-hidden rounded-3xl border border-border/80 bg-card transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
            >
              {/* Poster Container */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                {item.posterUrl ? (
                  <Image
                    src={item.posterUrl}
                    alt={item.name}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 384px"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-primary/15 via-primary/5 to-amber-500/10 p-6 text-center">
                    <Calendar className="size-10 text-primary/60" />
                    <p className="mt-2 text-xs font-semibold text-primary">Masjid Nurul Jannah</p>
                    <p className="mt-1 text-sm font-bold text-foreground line-clamp-2">{item.name}</p>
                  </div>
                )}
                {item.isFeatured && (
                  <span className="absolute left-3 top-3 rounded-full bg-amber-500 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-slate-950 shadow-md">
                    Kajian Pilihan
                  </span>
                )}
              </div>

              {/* Konten */}
              <div className="flex flex-1 flex-col justify-between p-5 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                    <Clock className="size-3.5" />
                    <span>
                      {formatDateIndonesia(item.date)} · {item.timeLabel}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-foreground line-clamp-2 group-hover:text-primary transition">
                    {item.name}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {item.description}
                  </p>
                </div>

                <div className="space-y-3 border-t border-border/60 pt-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground gap-2">
                    <div className="flex min-w-0 items-center gap-1.5">
                      <User className="size-3.5 shrink-0 text-primary" />
                      <span className="truncate font-medium text-foreground">{item.personInCharge}</span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <MapPin className="size-3.5 text-muted-foreground" />
                      <span className="line-clamp-1">{item.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <Link
                      href={ROUTE_PATHS.events}
                      className="flex min-h-[44px] flex-1 items-center justify-center rounded-xl bg-primary/10 px-4 py-2 text-center text-xs font-bold text-primary transition hover:bg-primary hover:text-white"
                    >
                      Detail Kegiatan
                    </Link>
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex size-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-50 text-emerald-700 transition hover:bg-emerald-600 hover:text-white dark:bg-emerald-950/50 dark:text-emerald-300"
                      title="Bagikan ke WhatsApp"
                    >
                      <Share2 className="size-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

