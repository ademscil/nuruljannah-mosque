import type { ScheduleListItem } from "@/features/schedules/types/schedule";
import { findSchedules } from "@/features/schedules/repositories/schedule-repository";

const fallbackSchedules: ScheduleListItem[] = [
  {
    id: "schedule-demo-1",
    title: "Sholat Subuh",
    roleType: "IMAM",
    scheduleFor: "2026-04-02T04:30:00+07:00",
    timeLabel: "04.30 WIB",
    personName: "Ustadz Ridwan",
    notes: "Fokus tilawah surah As-Sajdah.",
    source: "fallback",
  },
  {
    id: "schedule-demo-2",
    title: "Sholat Maghrib",
    roleType: "MUADZIN",
    scheduleFor: "2026-04-02T18:02:00+07:00",
    timeLabel: "18.02 WIB",
    personName: "Bapak Ihsan",
    notes: null,
    source: "fallback",
  },
  {
    id: "schedule-demo-3",
    title: "Sholat Jum'at",
    roleType: "KHATIB",
    scheduleFor: "2026-04-03T12:00:00+07:00",
    timeLabel: "12.00 WIB",
    personName: "KH. Abdul Malik",
    notes: "Tema khutbah: menjaga amanah sosial.",
    source: "fallback",
  },
  {
    id: "schedule-demo-4",
    title: "Kajian Remaja",
    roleType: "PETUGAS_KEGIATAN",
    scheduleFor: "2026-04-04T19:30:00+07:00",
    timeLabel: "19.30 WIB",
    personName: "Tim Remaja Masjid",
    notes: "Persiapan sound system dan dokumentasi.",
    source: "fallback",
  },
];

export async function getSchedules(): Promise<ScheduleListItem[]> {
  try {
    const schedules = await findSchedules();

    if (schedules.length === 0) {
      return fallbackSchedules;
    }

    return schedules.map((schedule) => ({
      id: schedule.id,
      title: schedule.title,
      roleType: schedule.roleType,
      scheduleFor: schedule.scheduleFor.toISOString(),
      timeLabel: schedule.timeLabel,
      personName: schedule.personName,
      notes: schedule.notes ?? null,
      source: "database",
    }));
  } catch {
    return fallbackSchedules;
  }
}
