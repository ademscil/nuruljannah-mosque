import { Clock3, UserRound, CalendarClock } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { formatDateIndonesia } from "@/lib/format-date";
import { Card3D } from "@/components/shared/card-3d";
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
    <div className="grid gap-5 perspective-normal lg:grid-cols-2">
      {schedules.map((item, i) => {
        const role = roleConfig[item.roleType];
        const roleIconBg = {
          IMAM: "bg-primary/10",
          MUADZIN: "bg-amber-100",
          KHATIB: "bg-teal-100",
          PETUGAS_KEGIATAN: "bg-violet-100",
        }[item.roleType];

        return (
          <Card3D key={item.id} variant="magnetic" delay={i * 0.06} className="group p-6">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1.5">
                <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${role.color} transition-all duration-300 group-hover:scale-105`}>
                  <span className={`size-1.5 rounded-full ${roleIconBg} transition-transform duration-300 group-hover:scale-125`} />
                  {role.label}
                </span>
                <h2 className="text-xl font-semibold tracking-tight">{item.title}</h2>
              </div>
            </div>

            <div className="mt-5 space-y-2.5">
              <div className="interactive-3d flex items-center gap-3 rounded-xl bg-muted/40 px-4 py-3">
                <div className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${roleIconBg} transition-transform duration-300 group-hover:scale-110`}>
                  <Clock3 className="size-4 text-primary" />
                </div>
                <div className="text-sm">
                  <p className="font-medium">{formatDateIndonesia(item.scheduleFor)}</p>
                  <p className="text-muted-foreground">{item.timeLabel}</p>
                </div>
              </div>
              <div className="interactive-3d flex items-center gap-3 rounded-xl bg-muted/40 px-4 py-3">
                <div className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${roleIconBg} transition-transform duration-300 group-hover:scale-110`}>
                  <UserRound className="size-4 text-primary" />
                </div>
                <div className="text-sm">
                  <p className="font-medium">{item.personName}</p>
                  <p className="text-muted-foreground">{item.notes ?? "Tanpa catatan tambahan"}</p>
                </div>
              </div>
            </div>
          </Card3D>
        );
      })}
    </div>
  );
}
