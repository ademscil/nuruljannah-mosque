import { CalendarCheck2, Clock3, Eye, Star } from "lucide-react";

import { StatsCard } from "@/components/shared/stats-card";
import type { EventListItem } from "@/features/events/types/event";

type EventSummaryCardsProps = {
  events: EventListItem[];
};

export function EventSummaryCards({ events }: EventSummaryCardsProps) {
  const nowTimestamp = new Date("2026-04-02T00:00:00+07:00").getTime();
  const publishedCount = events.filter((event) => event.status === "PUBLISHED").length;
  const featuredCount = events.filter((event) => event.isFeatured).length;
  const publicCount = events.filter((event) => event.isPublic).length;
  const upcomingCount = events.filter(
    (event) =>
      new Date(event.date).getTime() >= nowTimestamp &&
      event.status !== "CANCELLED" &&
      event.status !== "COMPLETED",
  ).length;

  return (
    <div className="grid gap-4 xl:grid-cols-4">
      <StatsCard
        title="Agenda Publish"
        value={`${publishedCount}`}
        description="Jumlah agenda yang tampil."
        icon={CalendarCheck2}
      />
      <StatsCard
        title="Agenda Terdekat"
        value={`${upcomingCount}`}
        description="Agenda yang akan datang."
        icon={Clock3}
      />
      <StatsCard
        title="Agenda Publik"
        value={`${publicCount}`}
        description="Bisa dilihat oleh jamaah."
        icon={Eye}
      />
      <StatsCard
        title="Agenda Unggulan"
        value={`${featuredCount}`}
        description="Diprioritaskan di beranda."
        icon={Star}
      />
    </div>
  );
}
