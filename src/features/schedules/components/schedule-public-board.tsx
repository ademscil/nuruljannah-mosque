import { Clock3, UserRound } from "lucide-react";

import { ContentPreviewCard } from "@/components/shared/content-preview-card";
import { formatDateIndonesia } from "@/lib/format-date";
import type { ScheduleListItem } from "@/features/schedules/types/schedule";

type SchedulePublicBoardProps = {
  schedules: ScheduleListItem[];
};

const roleLabelMap = {
  IMAM: "Imam",
  MUADZIN: "Muadzin",
  KHATIB: "Khatib",
  PETUGAS_KEGIATAN: "Petugas Kegiatan",
} as const;

export function SchedulePublicBoard({ schedules }: SchedulePublicBoardProps) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {schedules.map((item) => (
        <div
          key={item.id}
          className="rounded-[2rem] border border-border/70 bg-card p-6 shadow-sm"
        >
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700 dark:text-emerald-300">
              {roleLabelMap[item.roleType]}
            </p>
            <h2 className="text-xl font-semibold tracking-tight">{item.title}</h2>
          </div>
          <div className="mt-5 grid gap-3">
            <div className="flex items-center gap-3 rounded-2xl bg-muted/40 px-4 py-3">
              <Clock3 className="size-4 text-emerald-700 dark:text-emerald-300" />
              <div className="text-sm">
                <p>{formatDateIndonesia(item.scheduleFor)}</p>
                <p className="text-muted-foreground">{item.timeLabel}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-muted/40 px-4 py-3">
              <UserRound className="size-4 text-emerald-700 dark:text-emerald-300" />
              <div className="text-sm">
                <p>{item.personName}</p>
                <p className="text-muted-foreground">
                  {item.notes ?? "Tanpa catatan tambahan"}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}

      {schedules.length === 0 ? (
        <ContentPreviewCard
          title="Belum ada jadwal petugas"
          description="Jadwal imam, muadzin, khatib, dan petugas kegiatan akan tampil di sini."
        />
      ) : null}
    </div>
  );
}
