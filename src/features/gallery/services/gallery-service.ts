import { findGalleryItems } from "@/features/gallery/repositories/gallery-repository";
import type { GalleryItemRecord } from "@/features/gallery/types/gallery";

export async function getGalleryItems(): Promise<GalleryItemRecord[]> {
  try {
    const items = await findGalleryItems();
    return items.map((item) => ({
      id: item.id,
      title: item.title,
      category: item.category,
      imageUrl: item.imageUrl,
      activityDate: item.activityDate.toISOString(),
      status: item.status,
    }));
  } catch (error) {
    console.error("Failed to load gallery items:", error);
    return [];
  }
}

export async function getPublicGalleryItems(): Promise<GalleryItemRecord[]> {
  const items = await getGalleryItems();
  return items.filter((item) => item.status === "PUBLISHED");
}
