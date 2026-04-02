export type EventListItem = {
  id: string;
  name: string;
  slug: string;
  description: string;
  date: string;
  timeLabel: string;
  location: string;
  personInCharge: string;
  status: "DRAFT" | "PUBLISHED" | "COMPLETED" | "CANCELLED";
  isPublic: boolean;
  isFeatured: boolean;
  posterUrl: string | null;
  publishedAt: string | null;
  source: "database" | "fallback";
};
