"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Download, Landmark, Pencil, Plus, Sparkles, Trash2, Wallet } from "lucide-react";
import React, { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";

import { DataTable } from "@/components/shared/data-table";
import { FilterSelect } from "@/components/shared/filter-select";
import { SearchInput } from "@/components/shared/search-input";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { formatDateIndonesia } from "@/lib/format-date";
import { formatRupiah } from "@/lib/format-rupiah";
import { TransactionFormModal } from "@/features/finance/components/transaction-form-modal";
import { deleteTransactionAction } from "@/features/finance/services/transaction-actions";
import type { TransactionListItem } from "@/features/finance/types/transaction";

type FinanceTransactionTableProps = {
  transactions: TransactionListItem[];
};

type DeleteTransactionDialogProps = {
  transaction: TransactionListItem;
};

function DeleteTransactionDialog({
  transaction,
}: DeleteTransactionDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteTransactionAction(transaction.id);
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      toast.success(result.message);
      setOpen(false);
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        render={(props) => (
          <Button
            {...props}
            variant="ghost"
            size="icon"
            className="size-8 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="size-4" />
          </Button>
        )}
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus transaksi?</AlertDialogTitle>
          <AlertDialogDescription>
            Transaksi &quot;{transaction.description}&quot; akan dihapus
            permanen. Tindakan ini akan memengaruhi saldo kas dan ringkasan
            laporan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Batal</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? "Menghapus..." : "Hapus Transaksi"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

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
          <div className="space-y-1.5">
            <p className="font-semibold text-foreground">
              {row.original.description}
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {row.original.category}
            </p>
          </div>
        ),
      },
      {
        accessorKey: "type",
        header: "Jenis",
        cell: ({ row }) => {
          const isIncome = row.original.type === "INCOME";
          return (
            <div className="flex items-center gap-3">
              <div
                className={`flex size-9 shrink-0 items-center justify-center rounded-xl backdrop-blur-sm ${
                  isIncome
                    ? "bg-gradient-to-br from-emerald-500/20 to-teal-500/20"
                    : "bg-gradient-to-br from-amber-500/20 to-orange-500/20"
                }`}
              >
                {isIncome ? (
                  <Landmark className="size-4 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Wallet className="size-4 text-amber-600 dark:text-amber-400" />
                )}
              </div>
              <span
                className={`font-medium ${
                  isIncome
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-amber-600 dark:text-amber-400"
                }`}
              >
                {isIncome ? "Pemasukan" : "Pengeluaran"}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "amount",
        header: "Nominal",
        cell: ({ row }) => (
          <span className="font-semibold text-foreground">
            {formatRupiah(row.original.amount)}
          </span>
        ),
      },
      {
        accessorKey: "transactionAt",
        header: "Tanggal",
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {formatDateIndonesia(row.original.transactionAt)}
          </span>
        ),
      },
      {
        id: "actions",
        header: "Aksi",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <TransactionFormModal
              transaction={row.original}
              trigger={
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 text-muted-foreground hover:text-foreground"
                >
                  <Pencil className="size-4" />
                </Button>
              }
            />
            <DeleteTransactionDialog transaction={row.original} />
          </div>
        ),
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
    <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-br from-background via-background to-muted/20 shadow-depth-lg backdrop-blur-sm">
      {/* Decorative gradient overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-amber-500/5" />

      <div className="relative space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20">
              <Sparkles className="size-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold tracking-tight text-foreground">
                Riwayat Transaksi
              </h3>
              <p className="text-sm text-muted-foreground">
                Kelola catatan pemasukan dan pengeluaran masjid
              </p>
            </div>
          </div>
          <TransactionFormModal
            trigger={
              <Button>
                <Plus className="size-4" />
                Tambah Transaksi
              </Button>
            }
          />
        </div>

        {/* Filters and Actions */}
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="grid gap-3 xl:grid-cols-[1fr_200px_200px]">
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
            <Button variant="outline" size="sm">
              <Download className="size-3.5" />
              Export CSV
            </Button>
            <Button variant="outline" size="sm">
              <Download className="size-3.5" />
              Export PDF
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm">
          <DataTable columns={columns} data={filteredData} />
        </div>

        {/* Info footer */}
        <div className="flex items-center justify-between rounded-xl border border-border/50 bg-muted/30 px-4 py-3 backdrop-blur-sm">
          <p className="text-sm text-muted-foreground">
            Menampilkan{" "}
            <span className="font-semibold text-foreground">
              {filteredData.length}
            </span>{" "}
            dari{" "}
            <span className="font-semibold text-foreground">
              {transactions.length}
            </span>{" "}
            transaksi
          </p>
        </div>
      </div>
    </div>
  );
}
