"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Eye, EyeOff, Star } from "lucide-react";
import { useMemo, useState } from "react";

import { DataTable } from "@/components/shared/data-table";
import { FilterSelect } from "@/components/shared/filter-select";
import { SearchInput } from "@/components/shared/search-input";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDateIndonesia } from "@/lib/format-date";
import type { EventListItem } from "@/features/events/types/event";

type EventAdminTableProps = {
  events: EventListItem[];
};

const statusLabelMap = {
  DRAFT: "Draft",
  PUBLISHED: "Publish",
  COMPLETED: "Selesai",
  CANCELLED: "Dibatalkan",
} as const;

export function EventAdminTable({ events }: EventAdminTableProps) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("ALL");
  const [visibility, setVisibility] = useState("ALL");

  const columns = useMemo<ColumnDef<EventListItem>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Nama Kegiatan",
        cell: ({ row }) => {
          const item = row.original;

          return (
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <p className="font-medium">{item.name}</p>
                {item.isFeatured ? (
                  <Star className="size-3.5 fill-amber-400 text-amber-500" />
                ) : null}
              </div>
              <p className="text-xs text-muted-foreground">{item.slug}</p>
            </div>
          );
        },
      },
      {
        accessorKey: "date",
        header: "Jadwal",
        cell: ({ row }) => (
          <div className="space-y-1">
            <p>{formatDateIndonesia(row.original.date)}</p>
            <p className="text-xs text-muted-foreground">{row.original.timeLabel}</p>
          </div>
        ),
      },
      {
        accessorKey: "location",
        header: "Lokasi",
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <StatusBadge
            label={statusLabelMap[row.original.status]}
            value={
              row.original.status === "COMPLETED"
                ? "PUBLISHED"
                : row.original.status === "CANCELLED"
                  ? "ARCHIVED"
                  : row.original.status
            }
          />
        ),
      },
      {
        accessorKey: "isPublic",
        header: "Publik",
        cell: ({ row }) =>
          row.original.isPublic ? (
            <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-300">
              <Eye className="size-4" />
              Ya
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-muted-foreground">
              <EyeOff className="size-4" />
              Tidak
            </span>
          ),
      },
    ],
    [],
  );

  const filteredData = events.filter((item) => {
    const matchesQuery =
      query.length === 0 ||
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.location.toLowerCase().includes(query.toLowerCase()) ||
      item.personInCharge.toLowerCase().includes(query.toLowerCase());

    const matchesStatus = status === "ALL" || item.status === status;
    const matchesVisibility =
      visibility === "ALL" ||
      (visibility === "PUBLIC" && item.isPublic) ||
      (visibility === "INTERNAL" && !item.isPublic);

    return matchesQuery && matchesStatus && matchesVisibility;
  });

  return (
    <Card className="rounded-[2rem] border-border/60 shadow-sm">
      <CardContent className="space-y-5 p-6">
        <div className="grid gap-3 xl:grid-cols-[minmax(260px,1fr)_220px_220px]">
          <SearchInput
            value={query}
            placeholder="Cari kegiatan, lokasi, atau PIC..."
            onChange={setQuery}
          />
          <FilterSelect
            placeholder="Filter status"
            value={status}
            onValueChange={setStatus}
            options={[
              { label: "Semua Status", value: "ALL" },
              { label: "Draft", value: "DRAFT" },
              { label: "Publish", value: "PUBLISHED" },
              { label: "Selesai", value: "COMPLETED" },
              { label: "Dibatalkan", value: "CANCELLED" },
            ]}
          />
          <FilterSelect
            placeholder="Filter visibilitas"
            value={visibility}
            onValueChange={setVisibility}
            options={[
              { label: "Semua Visibilitas", value: "ALL" },
              { label: "Publik", value: "PUBLIC" },
              { label: "Internal", value: "INTERNAL" },
            ]}
          />
        </div>
        <DataTable columns={columns} data={filteredData} />
      </CardContent>
    </Card>
  );
}
