export type ScheduleListItem = {
  id: string;
  title: string;
  roleType: "IMAM" | "MUADZIN" | "KHATIB" | "PETUGAS_KEGIATAN";
  scheduleFor: string;
  timeLabel: string;
  personName: string;
  notes: string | null;
  source: "database" | "fallback";
};
