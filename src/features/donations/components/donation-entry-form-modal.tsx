"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, User, Wallet, FileText } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { FormFieldWrapper } from "@/components/shared/form-field-wrapper";
import { CurrencyInput } from "@/components/shared/currency-input";
import { useAutoSaveDraft } from "@/hooks/use-autosave-draft";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { DialogClose, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { saveDonationEntryAction } from "@/features/donations/services/donation-actions";
import {
  donationEntryFormSchema,
  type DonationEntryFormSchema,
} from "@/features/donations/schemas/donation-campaign-form-schema";
import type { DonationCampaignItem, DonationListItem } from "@/features/donations/types/donation";

type DonationEntryFormModalProps = {
  campaigns: DonationCampaignItem[];
  donation?: DonationListItem;
  trigger?: React.ReactElement;
};

function getDefaultValues(donation?: DonationListItem): DonationEntryFormSchema {
  return {
    id: donation?.id,
    donorName: donation?.donorName ?? "",
    donorEmail: donation?.donorEmail ?? "",
    donorPhone: donation?.donorPhone ?? "",
    amount: donation?.amount ?? 0,
    status: donation?.status ?? "PENDING",
    donatedAt: donation?.donatedAt ? donation.donatedAt.slice(0, 16) : "",
    campaignId: donation?.campaignId ?? "",
    note: donation?.note ?? "",
  };
}

export function DonationEntryFormModal({
  campaigns,
  donation,
  trigger,
}: DonationEntryFormModalProps) {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const form = useForm<DonationEntryFormSchema>({
    resolver: zodResolver(donationEntryFormSchema),
    defaultValues: getDefaultValues(donation),
  });

  const formKey = donation?.id ? ("draft_donation_" + donation.id) : "draft_donation_new";
  const amountValue = useWatch({ control: form.control, name: "amount" });
  const { clearDraft } = useAutoSaveDraft({
    key: formKey,
    watch: form.watch,
    isDirty: form.formState.isDirty,
    onRestore: (saved) => {
      form.reset({ ...getDefaultValues(donation), ...saved });
      toast.info("Draf data donasi berhasil dipulihkan.");
    },
  });

  const selectedStatus = useWatch({ control: form.control, name: "status" });
  const selectedCampaignId = useWatch({ control: form.control, name: "campaignId" });

  useEffect(() => {
    if (open) {
      form.reset(getDefaultValues(donation));
    }
  }, [open, donation, form]);

  const handleSubmit = (values: DonationEntryFormSchema) => {
    startTransition(async () => {
      const result = await saveDonationEntryAction(values);
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      clearDraft();
      toast.success(result.message);
      setOpen(false);
      form.reset(getDefaultValues());
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={(props) =>
          trigger ? (
            <span {...props} onClick={() => setOpen(true)}>
              {trigger}
            </span>
          ) : (
            <Button {...props} onClick={() => setOpen(true)}>
              <Plus className="size-4" />
              Tambah Donasi
            </Button>
          )
        }
      />
      <DialogContent className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-border/50 bg-gradient-to-br from-background via-background to-background/95 p-0 shadow-depth-xl">
        <div className="sticky top-0 z-10 border-b border-border/50 bg-gradient-to-br from-card/95 via-card/90 to-card/95 px-6 py-5 backdrop-blur-md">
          <DialogTitle className="font-heading text-xl font-bold">
            {donation ? "Edit Data Donasi" : "Tambah Donasi Baru"}
          </DialogTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            {donation ? "Perbarui informasi donasi yang sudah ada" : "Catat donasi masuk secara manual"}
          </p>
        </div>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5 p-6">
          {/* Donor Info Section */}
          <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-muted/30 to-muted/10 p-5 backdrop-blur-sm">
            <div className="mb-4 flex items-center gap-2">
              <User className="size-4 text-muted-foreground" />
              <span className="text-sm font-semibold text-foreground">Informasi Donatur</span>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <FormFieldWrapper label="Nama Donatur" error={form.formState.errors.donorName?.message}>
                <Input placeholder="Nama lengkap donatur" {...form.register("donorName")} />
              </FormFieldWrapper>
              <FormFieldWrapper label="Program Donasi" error={form.formState.errors.campaignId?.message}>
                <Select
                  value={selectedCampaignId || undefined}
                  onValueChange={(value) => {
                    if (value) form.setValue("campaignId", value);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih program donasi" />
                  </SelectTrigger>
                  <SelectContent>
                    {campaigns.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormFieldWrapper>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <FormFieldWrapper label="Email (opsional)">
                <Input type="email" placeholder="email@contoh.com" {...form.register("donorEmail")} />
              </FormFieldWrapper>
              <FormFieldWrapper label="Nomor HP (opsional)">
                <Input placeholder="08xxxxxxxxxx" {...form.register("donorPhone")} />
              </FormFieldWrapper>
            </div>
          </div>

          {/* Donation Details Section */}
          <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-muted/30 to-muted/10 p-5 backdrop-blur-sm">
            <div className="mb-4 flex items-center gap-2">
              <Wallet className="size-4 text-muted-foreground" />
              <span className="text-sm font-semibold text-foreground">Detail Donasi</span>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <FormFieldWrapper label="Jumlah Donasi" error={form.formState.errors.amount?.message} hint="Nominal infaq yang disetorkan">
                <CurrencyInput
                  value={amountValue ?? 0}
                  onChange={(val) => form.setValue("amount", val, { shouldValidate: true, shouldDirty: true })}
                  placeholder="Rp 0"
                />
              </FormFieldWrapper>
              <FormFieldWrapper label="Tanggal Donasi" error={form.formState.errors.donatedAt?.message}>
                <Input type="datetime-local" {...form.register("donatedAt")} />
              </FormFieldWrapper>
              <FormFieldWrapper
                label="Status Verifikasi"
                error={form.formState.errors.status?.message}
                hint="Ubah ke 'Terkonfirmasi' setelah dana diterima"
              >
                <Select
                  value={selectedStatus}
                  onValueChange={(value) =>
                    form.setValue("status", (value ?? "PENDING") as DonationEntryFormSchema["status"])
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Menunggu Konfirmasi</SelectItem>
                    <SelectItem value="CONFIRMED">Sudah Terkonfirmasi</SelectItem>
                    <SelectItem value="CANCELLED">Dibatalkan</SelectItem>
                  </SelectContent>
                </Select>
              </FormFieldWrapper>
            </div>
          </div>

          {/* Notes Section */}
          <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-muted/30 to-muted/10 p-5 backdrop-blur-sm">
            <div className="mb-4 flex items-center gap-2">
              <FileText className="size-4 text-muted-foreground" />
              <span className="text-sm font-semibold text-foreground">Catatan Tambahan</span>
            </div>
            <FormFieldWrapper label="Catatan (opsional)">
              <Textarea
                rows={3}
                placeholder="Catatan tambahan dari donatur atau pengurus..."
                {...form.register("note")}
              />
            </FormFieldWrapper>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 border-t border-border/50 pt-5">
            <DialogClose
              render={(props) => (
                <Button {...props} type="button" variant="outline" disabled={isPending}>
                  Batal
                </Button>
              )}
            />
            <Button type="submit" disabled={isPending}>
              {isPending ? "Menyimpan..." : donation ? "Simpan Perubahan" : "Tambah Donasi"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
