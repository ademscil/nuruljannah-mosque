"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";

import { DataTable } from "@/components/shared/data-table";
import { SearchInput } from "@/components/shared/search-input";
import { StatusBadge } from "@/components/shared/status-badge";
import type { ManagementMemberItem } from "@/features/management/types/management";

type ManagementAdminTableProps = {
  members: ManagementMemberItem[];
};

export function ManagementAdminTable({
  members,
}: ManagementAdminTableProps) {
  const [query, setQuery] = useState("");

  const columns = useMemo<ColumnDef<ManagementMemberItem>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Nama Pengurus",
        cell: ({ row }) => (
          <div className="space-y-1">
            <p className="font-medium">{row.original.name}</p>
            <p className="text-xs text-muted-foreground">{row.original.position}</p>
          </div>
        ),
      },
      {
        accessorKey: "termPeriod",
        header: "Periode",
      },
      {
        accessorKey: "phone",
        header: "Kontak",
        cell: ({ row }) => row.original.phone ?? "-",
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

  const filtered = members.filter((item) => {
    const q = query.toLowerCase();
    return (
      q.length === 0 ||
      item.name.toLowerCase().includes(q) ||
      item.position.toLowerCase().includes(q) ||
      item.termPeriod.toLowerCase().includes(q)
    );
  });

  return (
    <div className="card-elevated p-6 space-y-5">
      <SearchInput value={query} placeholder="Cari nama, jabatan, atau periode..." onChange={setQuery} />
      <DataTable columns={columns} data={filtered} />
    </div>
  );
}
