"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";

import { DataTable } from "@/components/shared/data-table";
import { FilterSelect } from "@/components/shared/filter-select";
import { SearchInput } from "@/components/shared/search-input";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatDateIndonesia } from "@/lib/format-date";
import type { AnnouncementListItem } from "@/features/announcements/types/announcement";

const statusLabelMap = { DRAFT: "Draft", PUBLISHED: "Publish", ARCHIVED: "Arsip" } as const;

export function AnnouncementAdminTable({ announcements }: { announcements: AnnouncementListItem[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("ALL");

  const columns = useMemo<ColumnDef<AnnouncementListItem>[]>(() => [
    {
      accessorKey: "title",
      header: "Judul",
      cell: ({ row }) => (
        <div>
          <p className="font-semibold">{row.original.title}</p>
          <p className="text-xs text-muted-foreground">{row.original.slug}</p>
        </div>
      ),
    },
    { accessorKey: "category", header: "Kategori" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge label={statusLabelMap[row.original.status]} value={row.original.status} />,
    },
    {
      accessorKey: "publishedAt",
      header: "Tanggal Tayang",
      cell: ({ row }) => row.original.publishedAt ? formatDateIndonesia(row.original.publishedAt) : "—",
    },
  ], []);

  const filtered = announcements.filter((item) => {
    const q = query.toLowerCase();
    return (q.length === 0 || item.title.toLowerCase().includes(q) || item.category.toLowerCase().includes(q))
      && (status === "ALL" || item.status === status);
  });

  return (
    <div className="card-elevated p-6 space-y-5">
      <div className="grid gap-3 md:grid-cols-[1fr_200px]">
        <SearchInput value={query} placeholder="Cari judul atau kategori..." onChange={setQuery} />
        <FilterSelect placeholder="Filter status" value={status} onValueChange={setStatus} options={[
          { label: "Semua Status", value: "ALL" },
          { label: "Draft", value: "DRAFT" },
          { label: "Publish", value: "PUBLISHED" },
          { label: "Arsip", value: "ARCHIVED" },
        ]} />
      </div>
      <DataTable columns={columns} data={filtered} />
    </div>
  );
}
