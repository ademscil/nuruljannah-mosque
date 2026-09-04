import { PageHeader } from "@/components/shared/page-header";
import { getCmsSettings } from "@/features/cms/services/cms-settings-service";
import { SchedulePublicBoard } from "@/features/schedules/components/schedule-public-board";
import { getSchedules } from "@/features/schedules/services/schedule-service";
import { PrayerTimesWidget } from "@/features/prayer-times/components/prayer-times-widget";
import { getTodayPrayerTimes } from "@/features/prayer-times/services/prayer-time-service";

export default async function JadwalSholatPage() {
  const [schedules, cms, prayerTimes] = await Promise.all([
    getSchedules(),
    getCmsSettings(),
    Promise.resolve(getTodayPrayerTimes()),
  ]);

  return (
    <div className="space-y-12 pb-16">
      <PageHeader
        eyebrow="Waktu Ibadah & Petugas"
        title={cms.contentBlocks.pageCopy.jadwalTitle || "Jadwal Waktu Salat & Petugas"}
        description={
          cms.contentBlocks.pageCopy.jadwalDescription ||
          "Jadwal salat 5 waktu harian astronomis standar Kemenag RI dan daftar penugasan Imam, Khatib, serta Muadzin di Masjid Nurul Jannah."
        }
      />

      {/* Widget Jadwal Salat 5 Waktu */}
      <section>
        <PrayerTimesWidget initialSchedule={prayerTimes} />
      </section>

      {/* Daftar Petugas Salat & Pengajian */}
      <section className="space-y-6">
        <div className="border-b border-border/60 pb-4">
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Jadwal Penugasan Petugas Masjid
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Daftar penugasan Imam rawatib, Khatib Jumat, Muadzin, dan petugas kegiatan peribadatan.
          </p>
        </div>
        <SchedulePublicBoard schedules={schedules} />
      </section>
    </div>
  );
}
