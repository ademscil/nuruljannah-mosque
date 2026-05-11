import { AccessDenied } from "@/components/shared/access-denied";
import { PageHeader } from "@/components/shared/page-header";
import { getAnnouncements } from "@/features/announcements/services/announcement-service";
import { HomepageContentForm } from "@/features/cms/components/homepage-content-form";
import { CmsSettingsForm } from "@/features/cms/components/cms-settings-form";
import { getCmsSettings } from "@/features/cms/services/cms-settings-service";
import { getHomepageContentForCms } from "@/features/cms/services/homepage-content-service";
import { getEvents } from "@/features/events/services/event-service";
import { hasDashboardPermission } from "@/lib/dashboard-access";

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
    <div className="space-y-8">
      <PageHeader
        eyebrow="CMS Internal"
        title="CMS Beranda"
        description="Kelola hero, sambutan singkat, agenda unggulan, pengumuman pilihan, dan CTA donasi dari dashboard admin."
      />
      <HomepageContentForm
        initialData={homepageContent}
        announcementOptions={announcements
          .filter((item) => item.status === "PUBLISHED")
          .map((item) => ({ id: item.id, label: item.title }))}
        eventOptions={events
          .filter((item) => item.status === "PUBLISHED" && item.isPublic)
          .map((item) => ({ id: item.id, label: item.name }))}
      />
      <CmsSettingsForm initialData={cmsSettings} />
    </div>
  );
}
