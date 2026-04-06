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
  const khatibCount = schedules.filter((item) => item.roleType === "KHATIB").length;
  const activityCount = schedules.filter(
    (item) => item.roleType === "PETUGAS_KEGIATAN",
  ).length;

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatsCard
        title="Jadwal Imam"
        value={`${imamCount}`}
        description="Petugas imam terjadwal."
        icon={UserRoundCheck}
      />
      <StatsCard
        title="Jadwal Muadzin"
        value={`${muadzinCount}`}
        description="Petugas adzan terjadwal."
        icon={Mic}
      />
      <StatsCard
        title="Jadwal Khatib"
        value={`${khatibCount}`}
        description="Khutbah Jum'at dan momen khusus."
        icon={NotebookPen}
      />
      <StatsCard
        title="Petugas Kegiatan"
        value={`${activityCount}`}
        description="Operasional acara dan kajian."
        icon={BellRing}
      />
    </div>
  );
}
