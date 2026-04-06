export type GalleryItemRecord = {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  activityDate: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  source: "database" | "fallback";
};
