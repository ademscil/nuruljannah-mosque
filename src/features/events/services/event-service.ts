import type { EventListItem } from "@/features/events/types/event";
import { findEvents } from "@/features/events/repositories/event-repository";

export async function getEvents(): Promise<EventListItem[]> {
  try {
    const events = await findEvents();
    return events.map((event) => ({
      id: event.id,
      name: event.name,
      slug: event.slug,
      description: event.description,
      date: event.date.toISOString(),
      timeLabel: event.timeLabel,
      location: event.location,
      personInCharge: event.personInCharge,
      status: event.status,
      isPublic: event.isPublic,
      isFeatured: event.isFeatured,
      posterUrl: event.posterUrl ?? null,
      publishedAt: event.publishedAt?.toISOString() ?? null,
    }));
  } catch (error) {
    console.error("Failed to load events:", error);
    return [];
  }
}

export async function getPublicEvents(): Promise<EventListItem[]> {
  const events = await getEvents();
  return events.filter((item) => item.status === "PUBLISHED" && item.isPublic);
}
