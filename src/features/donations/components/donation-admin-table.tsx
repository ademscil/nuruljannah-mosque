"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";

import { DataTable } from "@/components/shared/data-table";
import { FilterSelect } from "@/components/shared/filter-select";
import { SearchInput } from "@/components/shared/search-input";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatDateIndonesia } from "@/lib/format-date";
import { formatRupiah } from "@/lib/format-rupiah";
import type { DonationCampaignItem, DonationListItem } from "@/features/donations/types/donation";

type DonationAdminTableProps = {
  campaigns: DonationCampaignItem[];
  donations: DonationListItem[];
};

const statusLabelMap = {
  PENDING: "Menunggu",
  CONFIRMED: "Terkonfirmasi",
  CANCELLED: "Dibatalkan",
} as const;

export function DonationAdminTable({
  campaigns,
  donations,
}: DonationAdminTableProps) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("ALL");
  const [campaign, setCampaign] = useState("ALL");

  const columns = useMemo<ColumnDef<DonationListItem>[]>(
    () => [
      {
        accessorKey: "donorName",
        header: "Donatur",
        cell: ({ row }) => (
          <div className="space-y-1">
            <p className="font-medium">{row.original.donorName}</p>
            <p className="text-xs text-muted-foreground">
              {row.original.campaignTitle}
            </p>
          </div>
        ),
      },
      {
        accessorKey: "amount",
        header: "Nominal",
        cell: ({ row }) => formatRupiah(row.original.amount),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <StatusBadge
            label={statusLabelMap[row.original.status]}
            value={
              row.original.status === "CONFIRMED"
                ? "PUBLISHED"
                : row.original.status === "PENDING"
                  ? "DRAFT"
                  : "ARCHIVED"
            }
          />
        ),
      },
      {
        accessorKey: "donatedAt",
        header: "Tanggal",
        cell: ({ row }) => formatDateIndonesia(row.original.donatedAt),
      },
    ],
    [],
  );

  const filteredData = donations.filter((item) => {
    const matchesQuery =
      query.length === 0 ||
      item.donorName.toLowerCase().includes(query.toLowerCase()) ||
      item.campaignTitle.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = status === "ALL" || item.status === status;
    const matchesCampaign =
      campaign === "ALL" || item.campaignTitle === campaign;

    return matchesQuery && matchesStatus && matchesCampaign;
  });

  return (
    <div className="card-elevated p-6 space-y-5">
      <div className="grid gap-3 xl:grid-cols-[1fr_200px_200px]">
        <SearchInput value={query} placeholder="Cari donatur atau campaign..." onChange={setQuery} />
        <FilterSelect placeholder="Filter status" value={status} onValueChange={setStatus} options={[
          { label: "Semua Status", value: "ALL" },
          { label: "Menunggu", value: "PENDING" },
          { label: "Terkonfirmasi", value: "CONFIRMED" },
          { label: "Dibatalkan", value: "CANCELLED" },
        ]} />
        <FilterSelect placeholder="Filter campaign" value={campaign} onValueChange={setCampaign} options={[
          { label: "Semua Campaign", value: "ALL" },
          ...campaigns.map((item) => ({ label: item.title, value: item.title })),
        ]} />
      </div>
      <DataTable columns={columns} data={filteredData} />
    </div>
  );
}
