"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, FileText, Tag, Wallet } from "lucide-react";
import React, { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { FormFieldWrapper } from "@/components/shared/form-field-wrapper";
import { CurrencyInput } from "@/components/shared/currency-input";
import { SmartImageUploader } from "@/components/shared/smart-image-uploader";
import { useAutoSaveDraft } from "@/hooks/use-autosave-draft";
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
    amount: transaction?.amount ? Number(transaction.amount) : 0,
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

  const formKey = transaction?.id ? ("draft_tx_" + transaction.id) : "draft_tx_new";
  const { clearDraft } = useAutoSaveDraft({
    key: formKey,
    data: form.watch(),
    isDirty: form.formState.isDirty,
    onRestore: (saved) => {
      form.reset({ ...getDefaultValues(transaction), ...saved });
      toast.info("Draf transaksi berhasil dipulihkan.");
    },
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

      clearDraft();
      toast.success(result.message);
      setOpen(false);
      form.reset();
    });
  };

  const selectedType = form.watch("type");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />
      <DialogContent size="xl" className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {transaction ? "Edit Transaksi Kas" : "Catat Transaksi Kas Baru"}
          </DialogTitle>
          <DialogDescription>
            {transaction
              ? "Perbarui rincian kas masuk atau kas keluar masjid."
              : "Catat penerimaan infaq/sedekah atau pengeluaran operasional masjid secara akurat."}
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-5" onSubmit={form.handleSubmit(handleSubmit)}>
          {/* Type & Category Section */}
          <div className="space-y-4 rounded-2xl border border-border/50 bg-card/30 p-5 backdrop-blur-sm">
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/20 to-indigo-500/20">
                <Tag className="size-4 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold tracking-tight text-foreground">
                Jenis & Kategori Kas
              </h3>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormFieldWrapper
                label="Jenis Arus Kas"
                error={form.formState.errors.type?.message}
              >
                <Select
                  value={selectedType}
                  onValueChange={(value) =>
                    form.setValue(
                      "type",
                      (value ?? "INCOME") as TransactionFormSchema["type"],
                      { shouldValidate: true }
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis arus kas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INCOME">Pemasukan (Infaq / Sedekah / Hibah)</SelectItem>
                    <SelectItem value="EXPENSE">Pengeluaran (Operasional / Belanja)</SelectItem>
                  </SelectContent>
                </Select>
              </FormFieldWrapper>

              <FormFieldWrapper
                label="Kategori"
                error={form.formState.errors.category?.message}
                hint="Contoh: Infaq Jumat, Kebersihan, Listrik & Air"
              >
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  <Input
                    placeholder="Contoh: Infaq Tromol Jumat"
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
                label="Jumlah Nominal Kas"
                error={form.formState.errors.amount?.message}
                hint="Gunakan tombol cepat untuk nominal kelipatan umum"
              >
                <CurrencyInput
                  value={form.watch("amount") ?? 0}
                  onChange={(val) => form.setValue("amount", val, { shouldValidate: true, shouldDirty: true })}
                  placeholder="Rp 0"
                />
              </FormFieldWrapper>

              <FormFieldWrapper
                label="Tanggal Transaksi"
                error={form.formState.errors.transactionAt?.message}
              >
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
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
                Keterangan & Bukti Kwitansi
              </h3>
            </div>

            <FormFieldWrapper
              label="Keterangan Rinci"
              error={form.formState.errors.description?.message}
            >
              <Textarea
                rows={3}
                placeholder="Contoh: Pembelian lampu penerangan ruang utama dan pembersihan filter AC..."
                {...form.register("description")}
              />
            </FormFieldWrapper>

            <FormFieldWrapper
              label="Foto Bukti Kwitansi / Struk (Opsional)"
              error={form.formState.errors.attachmentUrl?.message}
              hint="Otomatis dikonversi ke WebP ringan (<150KB) untuk arsip digital bendahara"
            >
              <SmartImageUploader
                value={form.watch("attachmentUrl") ?? ""}
                onChange={(url) => form.setValue("attachmentUrl", url, { shouldValidate: true })}
                folder="finance"
                aspectRatio="free"
              />
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
