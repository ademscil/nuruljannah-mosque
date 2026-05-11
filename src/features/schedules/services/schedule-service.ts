import type { ScheduleListItem } from "@/features/schedules/types/schedule";
import { findSchedules } from "@/features/schedules/repositories/schedule-repository";

export async function getSchedules(): Promise<ScheduleListItem[]> {
  try {
    const schedules = await findSchedules();
    return schedules.map((schedule) => ({
      id: schedule.id,
      title: schedule.title,
      roleType: schedule.roleType,
      scheduleFor: schedule.scheduleFor.toISOString(),
      timeLabel: schedule.timeLabel,
      personName: schedule.personName,
      notes: schedule.notes ?? null,
    }));
  } catch (error) {
    console.error("Failed to load schedules:", error);
    return [];
  }
}
