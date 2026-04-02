import type { AnnouncementListItem } from "@/features/announcements/types/announcement";
import { findAnnouncements } from "@/features/announcements/repositories/announcement-repository";

const fallbackAnnouncements: AnnouncementListItem[] = [
  {
    id: "demo-1",
    title: "Kajian Tafsir Ahad Pagi",
    slug: "kajian-tafsir-ahad-pagi",
    content:
      "InsyaAllah kajian tafsir Ahad pagi akan dilaksanakan setelah sholat Subuh berjamaah di aula utama masjid.",
    category: "Kajian",
    status: "PUBLISHED",
    publishedAt: "2026-04-05T06:00:00+07:00",
    source: "fallback",
  },
  {
    id: "demo-2",
    title: "Santunan Ramadhan untuk Dhuafa",
    slug: "santunan-ramadhan-untuk-dhuafa",
    content:
      "Panitia membuka penyaluran santunan Ramadhan bagi warga dhuafa sekitar masjid. Jamaah dapat berpartisipasi melalui sekretariat.",
    category: "Sosial",
    status: "PUBLISHED",
    publishedAt: "2026-04-08T08:00:00+07:00",
    source: "fallback",
  },
  {
    id: "demo-3",
    title: "Pembaruan SOP Inventaris Masjid",
    slug: "pembaruan-sop-inventaris-masjid",
    content:
      "Draft SOP inventaris masjid sedang disusun dan akan direview pada rapat pengurus pekan ini.",
    category: "Internal",
    status: "DRAFT",
    publishedAt: null,
    source: "fallback",
  },
];

export async function getAnnouncements(): Promise<AnnouncementListItem[]> {
  try {
    const announcements = await findAnnouncements();

    if (announcements.length === 0) {
      return fallbackAnnouncements;
    }

    return announcements.map((announcement) => ({
      id: announcement.id,
      title: announcement.title,
      slug: announcement.slug,
      content: announcement.content,
      category: announcement.category,
      status: announcement.status,
      publishedAt: announcement.publishedAt?.toISOString() ?? null,
      source: "database",
    }));
  } catch {
    return fallbackAnnouncements;
  }
}
