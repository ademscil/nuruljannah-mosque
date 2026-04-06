import { AccessDenied } from "@/components/shared/access-denied";
import { PageHeader } from "@/components/shared/page-header";
import { ScheduleAdminTable } from "@/features/schedules/components/schedule-admin-table";
import { ScheduleFormPanel } from "@/features/schedules/components/schedule-form-panel";
import { ScheduleSummaryCards } from "@/features/schedules/components/schedule-summary-cards";
import { getSchedules } from "@/features/schedules/services/schedule-service";
import { hasDashboardPermission } from "@/lib/dashboard-access";

export default async function DashboardJadwalPetugasPage() {
  const canAccess = await hasDashboardPermission("jadwal-petugas");
  if (!canAccess) {
    return <AccessDenied />;
  }

  const schedules = await getSchedules();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="CMS Internal"
        title="Jadwal Petugas"
        description="Kelola jadwal imam, muadzin, khatib, dan petugas kegiatan dengan tampilan operasional yang rapi."
      />
      <ScheduleSummaryCards schedules={schedules} />
      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <ScheduleAdminTable schedules={schedules} />
        <ScheduleFormPanel schedules={schedules} />
      </div>
    </div>
  );
}
