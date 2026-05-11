import type { AnnouncementListItem } from "@/features/announcements/types/announcement";
import { findAnnouncements } from "@/features/announcements/repositories/announcement-repository";

export async function getAnnouncements(): Promise<AnnouncementListItem[]> {
  try {
    const announcements = await findAnnouncements();
    return announcements.map((announcement) => ({
      id: announcement.id,
      title: announcement.title,
      slug: announcement.slug,
      content: announcement.content,
      category: announcement.category,
      status: announcement.status,
      publishedAt: announcement.publishedAt?.toISOString() ?? null,
    }));
  } catch (error) {
    console.error("Failed to load announcements:", error);
    return [];
  }
}

export async function getPublicAnnouncements(): Promise<AnnouncementListItem[]> {
  const announcements = await getAnnouncements();
  return announcements.filter((item) => item.status === "PUBLISHED");
}
