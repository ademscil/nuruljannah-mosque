import { findGalleryItems } from "@/features/gallery/repositories/gallery-repository";
import type { GalleryItemRecord } from "@/features/gallery/types/gallery";

const fallbackItems: GalleryItemRecord[] = [
  {
    id: "gallery-demo-1",
    title: "Pesantren Kilat Remaja",
    category: "Pendidikan",
    imageUrl: "https://images.unsplash.com/photo-1519677100203-a0e668c92439?auto=format&fit=crop&w=1200&q=80",
    activityDate: "2026-03-24T08:00:00+07:00",
    status: "PUBLISHED",
    source: "fallback",
  },
  {
    id: "gallery-demo-2",
    title: "Bakti Sosial Warga",
    category: "Sosial",
    imageUrl: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1200&q=80",
    activityDate: "2026-03-18T09:00:00+07:00",
    status: "PUBLISHED",
    source: "fallback",
  },
];

export async function getGalleryItems(): Promise<GalleryItemRecord[]> {
  try {
    const items = await findGalleryItems();

    if (items.length === 0) {
      return fallbackItems;
    }

    return items.map((item) => ({
      id: item.id,
      title: item.title,
      category: item.category,
      imageUrl: item.imageUrl,
      activityDate: item.activityDate.toISOString(),
      status: item.status,
      source: "database",
    }));
  } catch {
    return fallbackItems;
  }
}
