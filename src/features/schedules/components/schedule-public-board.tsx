import { Clock3, UserRound, CalendarClock } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { formatDateIndonesia } from "@/lib/format-date";
import type { ScheduleListItem } from "@/features/schedules/types/schedule";

const roleConfig = {
  IMAM:             { label: "Imam", color: "bg-primary/8 text-primary border-primary/20" },
  MUADZIN:          { label: "Muadzin", color: "bg-amber-50 text-amber-700 border-amber-200" },
  KHATIB:           { label: "Khatib", color: "bg-teal-50 text-teal-700 border-teal-200" },
  PETUGAS_KEGIATAN: { label: "Petugas Kegiatan", color: "bg-violet-50 text-violet-700 border-violet-200" },
} as const;

export function SchedulePublicBoard({ schedules }: { schedules: ScheduleListItem[] }) {
  if (schedules.length === 0) {
    return <EmptyState icon={CalendarClock} title="Belum ada jadwal petugas" description="Jadwal imam, muadzin, khatib, dan petugas kegiatan akan tampil di sini." />;
  }

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {schedules.map((item, i) => {
        const role = roleConfig[item.roleType];
        return (
          <article
            key={item.id}
            style={{ animationDelay: `${i * 60}ms` }}
            className="animate-fade-up card-elevated group p-6 transition-all duration-300 hover:-translate-y-0.5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1.5">
                <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${role.color}`}>
                  {role.label}
                </span>
                <h2 className="text-xl font-semibold tracking-tight">{item.title}</h2>
              </div>
            </div>

            <div className="mt-5 space-y-2.5">
              <div className="flex items-center gap-3 rounded-xl bg-muted/40 px-4 py-3">
                <Clock3 className="size-4 shrink-0 text-primary" />
                <div className="text-sm">
                  <p className="font-medium">{formatDateIndonesia(item.scheduleFor)}</p>
                  <p className="text-muted-foreground">{item.timeLabel}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-muted/40 px-4 py-3">
                <UserRound className="size-4 shrink-0 text-primary" />
                <div className="text-sm">
                  <p className="font-medium">{item.personName}</p>
                  <p className="text-muted-foreground">{item.notes ?? "Tanpa catatan tambahan"}</p>
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
