import { AccessDenied } from "@/components/shared/access-denied";
import { getAnnouncements } from "@/features/announcements/services/announcement-service";
import { getCmsSettings } from "@/features/cms/services/cms-settings-service";
import { getHomepageContentForCms } from "@/features/cms/services/homepage-content-service";
import { getEvents } from "@/features/events/services/event-service";
import { hasDashboardPermission } from "@/lib/dashboard-access";
import { CmsBerandaView } from "@/features/cms/components/cms-beranda-view";

export default async function CmsBerandaPage() {
  const canAccess = await hasDashboardPermission("cms");
  if (!canAccess) {
    return <AccessDenied />;
  }

  const [homepageContent, announcements, events, cmsSettings] = await Promise.all([
    getHomepageContentForCms(),
    getAnnouncements(),
    getEvents(),
    getCmsSettings(),
  ]);

  return (
    <CmsBerandaView
      homepageContent={homepageContent}
      cmsSettings={cmsSettings}
      announcementOptions={announcements
        .filter((item) => item.status === "PUBLISHED")
        .map((item) => ({ id: item.id, label: item.title }))}
      eventOptions={events
        .filter((item) => item.status === "PUBLISHED" && item.isPublic)
        .map((item) => ({ id: item.id, label: item.name }))}
    />
  );
}
