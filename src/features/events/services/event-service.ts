import type { EventListItem } from "@/features/events/types/event";
import { findEvents } from "@/features/events/repositories/event-repository";

const fallbackEvents: EventListItem[] = [
  {
    id: "event-demo-1",
    name: "Buka Puasa Bersama Jamaah",
    slug: "buka-puasa-bersama-jamaah",
    description:
      "Program buka puasa bersama jamaah dan santunan anak yatim di aula serbaguna masjid.",
    date: "2026-04-10T17:00:00+07:00",
    timeLabel: "17.00 WIB",
    location: "Aula Serbaguna",
    personInCharge: "Rizky Hidayat",
    status: "PUBLISHED",
    isPublic: true,
    isFeatured: true,
    posterUrl: null,
    publishedAt: "2026-04-03T09:00:00+07:00",
    source: "fallback",
  },
  {
    id: "event-demo-2",
    name: "Kerja Bakti Ahad Bersih",
    slug: "kerja-bakti-ahad-bersih",
    description:
      "Agenda gotong royong membersihkan area masjid, taman, dan tempat wudhu.",
    date: "2026-04-12T07:00:00+07:00",
    timeLabel: "07.00 WIB",
    location: "Area Masjid",
    personInCharge: "Ahmad Fauzi",
    status: "PUBLISHED",
    isPublic: true,
    isFeatured: false,
    posterUrl: null,
    publishedAt: "2026-04-04T09:00:00+07:00",
    source: "fallback",
  },
  {
    id: "event-demo-3",
    name: "Rapat Evaluasi Program Remaja",
    slug: "rapat-evaluasi-program-remaja",
    description:
      "Rapat internal untuk evaluasi program pembinaan remaja masjid triwulan kedua.",
    date: "2026-04-14T20:00:00+07:00",
    timeLabel: "20.00 WIB",
    location: "Ruang Sekretariat",
    personInCharge: "Koordinator Kegiatan",
    status: "DRAFT",
    isPublic: false,
    isFeatured: false,
    posterUrl: null,
    publishedAt: null,
    source: "fallback",
  },
];

export async function getEvents(): Promise<EventListItem[]> {
  try {
    const events = await findEvents();

    if (events.length === 0) {
      return fallbackEvents;
    }

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
      source: "database",
    }));
  } catch {
    return fallbackEvents;
  }
}
