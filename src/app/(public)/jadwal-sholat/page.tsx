import { PageHeader } from "@/components/shared/page-header";
import { getCmsSettings } from "@/features/cms/services/cms-settings-service";
import { SchedulePublicBoard } from "@/features/schedules/components/schedule-public-board";
import { getSchedules } from "@/features/schedules/services/schedule-service";

export default async function JadwalSholatPage() {
  const [schedules, cms] = await Promise.all([getSchedules(), getCmsSettings()]);

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Halaman Publik"
        title={cms.contentBlocks.pageCopy.jadwalTitle}
        description={cms.contentBlocks.pageCopy.jadwalDescription}
      />
      <SchedulePublicBoard schedules={schedules} />
    </div>
  );
}
