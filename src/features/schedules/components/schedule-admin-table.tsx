"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";

import { DataTable } from "@/components/shared/data-table";
import { FilterSelect } from "@/components/shared/filter-select";
import { SearchInput } from "@/components/shared/search-input";
import { formatDateIndonesia } from "@/lib/format-date";
import type { ScheduleListItem } from "@/features/schedules/types/schedule";

type ScheduleAdminTableProps = {
  schedules: ScheduleListItem[];
};

const roleLabelMap = {
  IMAM: "Imam",
  MUADZIN: "Muadzin",
  KHATIB: "Khatib",
  PETUGAS_KEGIATAN: "Petugas Kegiatan",
} as const;

export function ScheduleAdminTable({ schedules }: ScheduleAdminTableProps) {
  const [query, setQuery] = useState("");
  const [roleType, setRoleType] = useState("ALL");

  const columns = useMemo<ColumnDef<ScheduleListItem>[]>(
    () => [
      {
        accessorKey: "title",
        header: "Kegiatan",
        cell: ({ row }) => (
          <div className="space-y-1">
            <p className="font-medium">{row.original.title}</p>
            <p className="text-xs text-muted-foreground">
              {row.original.notes ?? "Tanpa catatan tambahan"}
            </p>
          </div>
        ),
      },
      {
        accessorKey: "roleType",
        header: "Peran",
        cell: ({ row }) => roleLabelMap[row.original.roleType],
      },
      {
        accessorKey: "scheduleFor",
        header: "Jadwal",
        cell: ({ row }) => (
          <div className="space-y-1">
            <p>{formatDateIndonesia(row.original.scheduleFor)}</p>
            <p className="text-xs text-muted-foreground">{row.original.timeLabel}</p>
          </div>
        ),
      },
      {
        accessorKey: "personName",
        header: "Petugas",
      },
    ],
    [],
  );

  const filteredData = schedules.filter((item) => {
    const matchesQuery =
      query.length === 0 ||
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.personName.toLowerCase().includes(query.toLowerCase());

    const matchesRole = roleType === "ALL" || item.roleType === roleType;

    return matchesQuery && matchesRole;
  });

  return (
    <div className="card-elevated p-6 space-y-5">
      <div className="grid gap-3 md:grid-cols-[1fr_220px]">
        <SearchInput value={query} placeholder="Cari kegiatan atau nama petugas..." onChange={setQuery} />
        <FilterSelect placeholder="Filter peran" value={roleType} onValueChange={setRoleType} options={[
          { label: "Semua Peran", value: "ALL" },
          { label: "Imam", value: "IMAM" },
          { label: "Muadzin", value: "MUADZIN" },
          { label: "Khatib", value: "KHATIB" },
          { label: "Petugas Kegiatan", value: "PETUGAS_KEGIATAN" },
        ]} />
      </div>
      <DataTable columns={columns} data={filteredData} />
    </div>
  );
}
