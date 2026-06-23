import { BellRing, Mic, NotebookPen, UserRoundCheck } from "lucide-react";

import { StatsCard } from "@/components/shared/stats-card";
import type { ScheduleListItem } from "@/features/schedules/types/schedule";

type ScheduleSummaryCardsProps = {
  schedules: ScheduleListItem[];
};

export function ScheduleSummaryCards({
  schedules,
}: ScheduleSummaryCardsProps) {
  const imamCount = schedules.filter((item) => item.roleType === "IMAM").length;
  const muadzinCount = schedules.filter(
    (item) => item.roleType === "MUADZIN",
  ).length;
  const khatibCount = schedules.filter(
    (item) => item.roleType === "KHATIB",
  ).length;
  const activityCount = schedules.filter(
    (item) => item.roleType === "PETUGAS_KEGIATAN",
  ).length;

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatsCard
        title="Jadwal Imam"
        value={`${imamCount}`}
        description="Petugas imam terjadwal untuk sholat berjamaah"
        icon={UserRoundCheck}
        iconColor="text-blue-600"
        iconBg="bg-blue-50"
      />
      <StatsCard
        title="Jadwal Muadzin"
        value={`${muadzinCount}`}
        description="Petugas adzan dan iqomah terjadwal"
        icon={Mic}
        iconColor="text-purple-600"
        iconBg="bg-purple-50"
      />
      <StatsCard
        title="Jadwal Khatib"
        value={`${khatibCount}`}
        description="Khutbah Jum'at dan momen istimewa lainnya"
        icon={NotebookPen}
        iconColor="text-emerald-600"
        iconBg="bg-emerald-50"
      />
      <StatsCard
        title="Petugas Kegiatan"
        value={`${activityCount}`}
        description="Koordinator operasional acara dan kajian"
        icon={BellRing}
        iconColor="text-amber-600"
        iconBg="bg-amber-50"
      />
    </div>
  );
}
