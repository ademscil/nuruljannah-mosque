"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, Trash2 } from "lucide-react";
import { useMemo, useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { FormFieldWrapper } from "@/components/shared/form-field-wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  deleteTransactionAction,
  saveTransactionAction,
} from "@/features/finance/services/transaction-actions";
import {
  transactionFormSchema,
  type TransactionFormSchema,
} from "@/features/finance/schemas/transaction-form-schema";
import type { TransactionListItem } from "@/features/finance/types/transaction";

type TransactionFormPanelProps = {
  transactions: TransactionListItem[];
};

function getDefaultValues(
  transaction?: TransactionListItem,
): TransactionFormSchema {
  return {
    id: transaction?.id,
    type: transaction?.type ?? "INCOME",
    category: transaction?.category ?? "",
    amount: transaction?.amount ?? 0,
    transactionAt: transaction?.transactionAt
      ? transaction.transactionAt.slice(0, 16)
      : "",
    description: transaction?.description ?? "",
    attachmentUrl: transaction?.attachmentUrl ?? "",
  };
}

export function TransactionFormPanel({
  transactions,
}: TransactionFormPanelProps) {
  const [selectedId, setSelectedId] = useState("new");
  const [isPending, startTransition] = useTransition();

  const selectedTransaction = useMemo(
    () => transactions.find((item) => item.id === selectedId),
    [transactions, selectedId],
  );

  const form = useForm<TransactionFormSchema>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: getDefaultValues(),
  });
  const selectedType = useWatch({
    control: form.control,
    name: "type",
  });

  const resetSelection = (id: string | null) => {
    if (!id) {
      return;
    }

    setSelectedId(id);
    const transaction = transactions.find((item) => item.id === id);
    form.reset(getDefaultValues(transaction));
  };

  const handleSubmit = (values: TransactionFormSchema) => {
    startTransition(async () => {
      const result = await saveTransactionAction(values);
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      toast.success(result.message);
      if (selectedId === "new") resetSelection("new");
    });
  };

  const handleDelete = () => {
    if (!selectedTransaction) return;
    startTransition(async () => {
      const result = await deleteTransactionAction(selectedTransaction.id);
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      toast.success(result.message);
      resetSelection("new");
    });
  };

  return (
    <div className="card-elevated p-6">
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Tambah / Edit Transaksi</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Pilih transaksi yang ingin diedit, atau catat transaksi baru.
          </p>
        </div>
        <FormFieldWrapper label="Pilih Transaksi" hint="Pilih 'Tambah Baru' untuk mencatat transaksi baru">
          <Select value={selectedId} onValueChange={resetSelection}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih transaksi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">+ Tambah Transaksi Baru</SelectItem>
              {transactions.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.description}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormFieldWrapper>
      </div>
      <form className="mt-6 space-y-5" onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="grid gap-5 md:grid-cols-2">
          <FormFieldWrapper
            label="Jenis Transaksi"
            error={form.formState.errors.type?.message}
          >
            <Select
              value={selectedType}
              onValueChange={(value) =>
                form.setValue(
                  "type",
                  (value ?? "INCOME") as TransactionFormSchema["type"],
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih jenis" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INCOME">Pemasukan</SelectItem>
                <SelectItem value="EXPENSE">Pengeluaran</SelectItem>
              </SelectContent>
            </Select>
          </FormFieldWrapper>
          <FormFieldWrapper
            label="Kategori"
            error={form.formState.errors.category?.message}
            hint="Contoh: Infaq, Zakat, Operasional, Renovasi"
          >
            <Input placeholder="Contoh: Infaq Jumat" {...form.register("category")} />
          </FormFieldWrapper>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <FormFieldWrapper
            label="Jumlah (Rp)"
            error={form.formState.errors.amount?.message}
          >
            <Input type="number" placeholder="Contoh: 500000" {...form.register("amount", { valueAsNumber: true })} />
          </FormFieldWrapper>
          <FormFieldWrapper
            label="Tanggal Transaksi"
            error={form.formState.errors.transactionAt?.message}
          >
            <Input type="datetime-local" {...form.register("transactionAt")} />
          </FormFieldWrapper>
        </div>
        <FormFieldWrapper
          label="Keterangan"
          error={form.formState.errors.description?.message}
        >
          <Textarea rows={4} placeholder="Jelaskan sumber atau tujuan transaksi ini..." {...form.register("description")} />
        </FormFieldWrapper>
        <FormFieldWrapper
          label="Link Bukti Transaksi (opsional)"
          error={form.formState.errors.attachmentUrl?.message}
          hint="Tempel link foto bukti transfer atau kwitansi"
        >
          <Input placeholder="https://drive.google.com/..." {...form.register("attachmentUrl")} />
        </FormFieldWrapper>
        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={isPending} className="button-brand">
            {isPending ? (
              <>
                <LoaderCircle className="size-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              "Simpan Transaksi"
            )}
          </Button>
          {selectedTransaction ? (
            <ConfirmDialog
              title="Hapus transaksi?"
              description="Transaksi yang dihapus akan memengaruhi saldo kas dan ringkasan laporan."
              confirmLabel="Hapus Transaksi"
              onConfirm={handleDelete}
              trigger={
                <Button type="button" variant="outline" disabled={isPending}>
                  <Trash2 className="size-4" />
                  Hapus
                </Button>
              }
            />
          ) : null}
        </div>
      </form>
    </div>
  );
}
