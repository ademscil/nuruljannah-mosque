export type AnnouncementListItem = {
  id: string;
  title: string;
  slug: string;
  content: string;
  category: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  publishedAt: string | null;
  source: "database" | "fallback";
};
