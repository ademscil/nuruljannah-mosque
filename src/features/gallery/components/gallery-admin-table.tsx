"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";

import { DataTable } from "@/components/shared/data-table";
import { SearchInput } from "@/components/shared/search-input";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatDateIndonesia } from "@/lib/format-date";
import type { GalleryItemRecord } from "@/features/gallery/types/gallery";

type GalleryAdminTableProps = {
  items: GalleryItemRecord[];
};

export function GalleryAdminTable({ items }: GalleryAdminTableProps) {
  const [query, setQuery] = useState("");

  const columns = useMemo<ColumnDef<GalleryItemRecord>[]>(
    () => [
      {
        accessorKey: "title",
        header: "Judul Galeri",
        cell: ({ row }) => (
          <div className="space-y-1">
            <p className="font-medium">{row.original.title}</p>
            <p className="text-xs text-muted-foreground">{row.original.category}</p>
          </div>
        ),
      },
      {
        accessorKey: "activityDate",
        header: "Tanggal",
        cell: ({ row }) => formatDateIndonesia(row.original.activityDate),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <StatusBadge label="Publish" value={row.original.status} />,
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

  const filtered = items.filter((item) => {
    const q = query.toLowerCase();
    return (
      q.length === 0 ||
      item.title.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  });

  return (
    <div className="card-elevated p-6 space-y-5">
      <SearchInput value={query} placeholder="Cari judul atau kategori galeri..." onChange={setQuery} />
      <DataTable columns={columns} data={filtered} />
    </div>
  );
}
