"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";

import { DataTable } from "@/components/shared/data-table";
import { FilterSelect } from "@/components/shared/filter-select";
import { SearchInput } from "@/components/shared/search-input";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDateIndonesia } from "@/lib/format-date";
import type { AnnouncementListItem } from "@/features/announcements/types/announcement";

type AnnouncementAdminTableProps = {
  announcements: AnnouncementListItem[];
};

const statusLabelMap = {
  DRAFT: "Draft",
  PUBLISHED: "Publish",
  ARCHIVED: "Archived",
} as const;

export function AnnouncementAdminTable({
  announcements,
}: AnnouncementAdminTableProps) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("ALL");

  const columns = useMemo<ColumnDef<AnnouncementListItem>[]>(
    () => [
      {
        accessorKey: "title",
        header: "Judul",
        cell: ({ row }) => {
          const item = row.original;

          return (
            <div className="space-y-1">
              <p className="font-medium">{item.title}</p>
              <p className="text-xs text-muted-foreground">{item.slug}</p>
            </div>
          );
        },
      },
      {
        accessorKey: "category",
        header: "Kategori",
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <StatusBadge
            label={statusLabelMap[row.original.status]}
            value={row.original.status}
          />
        ),
      },
      {
        accessorKey: "publishedAt",
        header: "Tanggal Publish",
        cell: ({ row }) =>
          row.original.publishedAt
            ? formatDateIndonesia(row.original.publishedAt)
            : "Belum dipublish",
      },
      {
        accessorKey: "source",
        header: "Sumber",
        cell: ({ row }) =>
          row.original.source === "database" ? "Database" : "Demo",
      },
    ],
    [],
  );

  const filteredData = announcements.filter((item) => {
    const matchesQuery =
      query.length === 0 ||
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase());

    const matchesStatus = status === "ALL" || item.status === status;

    return matchesQuery && matchesStatus;
  });

  return (
    <Card className="rounded-[2rem] border-border/60 shadow-sm">
      <CardContent className="space-y-5 p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="grid gap-3 md:grid-cols-[minmax(260px,1fr)_220px]">
            <SearchInput
              value={query}
              placeholder="Cari judul atau kategori..."
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
                { label: "Archived", value: "ARCHIVED" },
              ]}
            />
          </div>
        </div>
        <DataTable columns={columns} data={filteredData} />
      </CardContent>
    </Card>
  );
}
