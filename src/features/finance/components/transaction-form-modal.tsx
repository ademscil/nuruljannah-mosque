"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, FileText, Link2, Tag, Wallet } from "lucide-react";
import React, { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { FormFieldWrapper } from "@/components/shared/form-field-wrapper";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { saveTransactionAction } from "@/features/finance/services/transaction-actions";
import {
  transactionFormSchema,
  type TransactionFormSchema,
} from "@/features/finance/schemas/transaction-form-schema";
import type { TransactionListItem } from "@/features/finance/types/transaction";

type TransactionFormModalProps = {
  transaction?: TransactionListItem;
  trigger: React.ReactElement;
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

export function TransactionFormModal({
  transaction,
  trigger,
}: TransactionFormModalProps) {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = React.useState(false);

  const form = useForm<TransactionFormSchema>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: getDefaultValues(transaction),
  });

  useEffect(() => {
    if (open) {
      form.reset(getDefaultValues(transaction));
    }
  }, [open, transaction, form]);

  const handleSubmit = (values: TransactionFormSchema) => {
    startTransition(async () => {
      const result = await saveTransactionAction(values);
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      toast.success(result.message);
      setOpen(false);
      form.reset(getDefaultValues());
    });
  };

  const selectedType = form.watch("type");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={(props) => trigger && React.cloneElement(trigger, props)} />
      <DialogContent size="xl" className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {transaction ? "Edit Transaksi" : "Tambah Transaksi Baru"}
          </DialogTitle>
          <DialogDescription>
            {transaction
              ? "Perbarui informasi transaksi keuangan masjid"
              : "Catat transaksi pemasukan atau pengeluaran baru"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Transaction Info Section */}
          <div className="space-y-4 rounded-2xl border border-border/50 bg-card/30 p-5 backdrop-blur-sm">
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20">
                <FileText className="size-4 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold tracking-tight text-foreground">
                Informasi Transaksi
              </h3>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormFieldWrapper
                label="Jenis Transaksi"
                error={form.formState.errors.type?.message}
              >
                <div className="relative">
                  <Wallet className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Select
                    value={selectedType}
                    onValueChange={(value) =>
                      form.setValue(
                        "type",
                        (value ?? "INCOME") as TransactionFormSchema["type"],
                      )
                    }
                  >
                    <SelectTrigger className="pl-10">
                      <SelectValue placeholder="Pilih jenis" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INCOME">Pemasukan</SelectItem>
                      <SelectItem value="EXPENSE">Pengeluaran</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </FormFieldWrapper>

              <FormFieldWrapper
                label="Kategori"
                error={form.formState.errors.category?.message}
                hint="Contoh: Infaq, Zakat, Operasional"
              >
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Contoh: Infaq Jumat"
                    className="pl-10"
                    {...form.register("category")}
                  />
                </div>
              </FormFieldWrapper>
            </div>
          </div>

          {/* Amount & Date Section */}
          <div className="space-y-4 rounded-2xl border border-border/50 bg-card/30 p-5 backdrop-blur-sm">
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/20">
                <Wallet className="size-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="font-semibold tracking-tight text-foreground">
                Nominal & Tanggal
              </h3>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormFieldWrapper
                label="Jumlah (Rp)"
                error={form.formState.errors.amount?.message}
              >
                <Input
                  type="number"
                  placeholder="Contoh: 500000"
                  {...form.register("amount", { valueAsNumber: true })}
                />
              </FormFieldWrapper>

              <FormFieldWrapper
                label="Tanggal Transaksi"
                error={form.formState.errors.transactionAt?.message}
              >
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="datetime-local"
                    className="pl-10"
                    {...form.register("transactionAt")}
                  />
                </div>
              </FormFieldWrapper>
            </div>
          </div>

          {/* Description & Attachment Section */}
          <div className="space-y-4 rounded-2xl border border-border/50 bg-card/30 p-5 backdrop-blur-sm">
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                <FileText className="size-4 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold tracking-tight text-foreground">
                Keterangan & Lampiran
              </h3>
            </div>

            <FormFieldWrapper
              label="Keterangan"
              error={form.formState.errors.description?.message}
            >
              <Textarea
                rows={4}
                placeholder="Jelaskan sumber atau tujuan transaksi ini..."
                {...form.register("description")}
              />
            </FormFieldWrapper>

            <FormFieldWrapper
              label="Link Bukti Transaksi (opsional)"
              error={form.formState.errors.attachmentUrl?.message}
              hint="Tempel link foto bukti transfer atau kwitansi"
            >
              <div className="relative">
                <Link2 className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="https://drive.google.com/..."
                  className="pl-10"
                  {...form.register("attachmentUrl")}
                />
              </div>
            </FormFieldWrapper>
          </div>

          <DialogFooter>
            <DialogClose
              render={(props) => (
                <Button {...props} type="button" variant="outline" disabled={isPending}>
                  Batal
                </Button>
              )}
            />
            <Button type="submit" disabled={isPending}>
              {isPending ? "Menyimpan..." : "Simpan Transaksi"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
