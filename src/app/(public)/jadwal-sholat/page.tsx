import { PageHeader } from "@/components/shared/page-header";
import { SchedulePublicBoard } from "@/features/schedules/components/schedule-public-board";
import { getSchedules } from "@/features/schedules/services/schedule-service";

export default async function JadwalSholatPage() {
  const schedules = await getSchedules();

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Halaman Publik"
        title="Jadwal Sholat & Petugas"
        description="Informasi jadwal petugas ibadah dan kegiatan yang dapat diakses jamaah secara publik."
      />
      <SchedulePublicBoard schedules={schedules} />
    </div>
  );
}
