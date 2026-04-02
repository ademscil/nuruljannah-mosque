import { ContentPreviewCard } from "@/components/shared/content-preview-card";
import { PageHeader } from "@/components/shared/page-header";
import { ScheduleAdminTable } from "@/features/schedules/components/schedule-admin-table";
import { ScheduleSummaryCards } from "@/features/schedules/components/schedule-summary-cards";
import { getSchedules } from "@/features/schedules/services/schedule-service";

export default async function DashboardJadwalPetugasPage() {
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
        <ContentPreviewCard
          eyebrow="Tahap Lanjut"
          title="Form CRUD Jadwal"
          description="Tahap berikutnya saya bisa menambahkan form tambah jadwal, edit penugas, dan tampilan jadwal per hari atau per pekan."
        />
      </div>
    </div>
  );
}
