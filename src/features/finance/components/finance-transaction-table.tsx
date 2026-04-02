"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Download } from "lucide-react";
import { useMemo, useState } from "react";

import { DataTable } from "@/components/shared/data-table";
import { FilterSelect } from "@/components/shared/filter-select";
import { SearchInput } from "@/components/shared/search-input";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDateIndonesia } from "@/lib/format-date";
import { formatRupiah } from "@/lib/format-rupiah";
import type { TransactionListItem } from "@/features/finance/types/transaction";

type FinanceTransactionTableProps = {
  transactions: TransactionListItem[];
};

export function FinanceTransactionTable({
  transactions,
}: FinanceTransactionTableProps) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("ALL");
  const [category, setCategory] = useState("ALL");

  const categories = Array.from(
    new Set(transactions.map((item) => item.category)),
  ).sort();

  const columns = useMemo<ColumnDef<TransactionListItem>[]>(
    () => [
      {
        accessorKey: "description",
        header: "Transaksi",
        cell: ({ row }) => (
          <div className="space-y-1">
            <p className="font-medium">{row.original.description}</p>
            <p className="text-xs text-muted-foreground">{row.original.category}</p>
          </div>
        ),
      },
      {
        accessorKey: "type",
        header: "Jenis",
        cell: ({ row }) => (
          <StatusBadge
            label={row.original.type === "INCOME" ? "Pemasukan" : "Pengeluaran"}
            value={row.original.type === "INCOME" ? "PUBLISHED" : "ARCHIVED"}
          />
        ),
      },
      {
        accessorKey: "amount",
        header: "Nominal",
        cell: ({ row }) => formatRupiah(row.original.amount),
      },
      {
        accessorKey: "transactionAt",
        header: "Tanggal",
        cell: ({ row }) => formatDateIndonesia(row.original.transactionAt),
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

  const filteredData = transactions.filter((item) => {
    const matchesQuery =
      query.length === 0 ||
      item.description.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase());
    const matchesType = type === "ALL" || item.type === type;
    const matchesCategory = category === "ALL" || item.category === category;

    return matchesQuery && matchesType && matchesCategory;
  });

  return (
    <Card className="glass-panel aurora-border rounded-[2rem] shadow-[0_30px_90px_-50px_rgba(15,23,42,0.45)]">
      <CardContent className="space-y-5 p-6">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="grid gap-3 xl:grid-cols-[minmax(260px,1fr)_220px_220px]">
            <SearchInput
              value={query}
              placeholder="Cari deskripsi atau kategori..."
              onChange={setQuery}
            />
            <FilterSelect
              placeholder="Filter jenis"
              value={type}
              onValueChange={setType}
              options={[
                { label: "Semua Jenis", value: "ALL" },
                { label: "Pemasukan", value: "INCOME" },
                { label: "Pengeluaran", value: "EXPENSE" },
              ]}
            />
            <FilterSelect
              placeholder="Filter kategori"
              value={category}
              onValueChange={setCategory}
              options={[
                { label: "Semua Kategori", value: "ALL" },
                ...categories.map((item) => ({ label: item, value: item })),
              ]}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="rounded-full bg-white/60">
              <Download className="size-4" />
              Export CSV
            </Button>
            <Button variant="outline" className="rounded-full bg-white/60">
              <Download className="size-4" />
              Export PDF
            </Button>
          </div>
        </div>
        <DataTable columns={columns} data={filteredData} />
      </CardContent>
    </Card>
  );
}
