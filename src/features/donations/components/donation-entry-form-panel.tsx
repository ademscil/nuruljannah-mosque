"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { HandCoins, Trash2, Sparkles, User, Tag, Wallet, Calendar, FileText } from "lucide-react";
import { useMemo, useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { ConfirmSubmitButton } from "@/components/shared/confirm-submit-button";
import { EmptyState } from "@/components/shared/empty-state";
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
  deleteDonationEntryAction,
  saveDonationEntryAction,
} from "@/features/donations/services/donation-actions";
import {
  donationEntryFormSchema,
  type DonationEntryFormSchema,
} from "@/features/donations/schemas/donation-campaign-form-schema";
import type {
  DonationCampaignItem,
  DonationListItem,
} from "@/features/donations/types/donation";

type DonationEntryFormPanelProps = {
  campaigns: DonationCampaignItem[];
  donations: DonationListItem[];
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

export function DonationEntryFormPanel({
  campaigns,
  donations,
}: DonationEntryFormPanelProps) {
  const [selectedId, setSelectedId] = useState("new");
  const [isPending, startTransition] = useTransition();

  const selectedDonation = useMemo(
    () => donations.find((item) => item.id === selectedId),
    [donations, selectedId],
  );

  const form = useForm<DonationEntryFormSchema>({
    resolver: zodResolver(donationEntryFormSchema),
    defaultValues: getDefaultValues(),
  });

  const selectedStatus = useWatch({
    control: form.control,
    name: "status",
  });
  const selectedCampaignId = useWatch({
    control: form.control,
    name: "campaignId",
  });

  const resetSelection = (id: string | null) => {
    if (!id) {
      return;
    }

    setSelectedId(id);
    const donation = donations.find((item) => item.id === id);
    form.reset(getDefaultValues(donation));
  };

  const handleSubmit = (values: DonationEntryFormSchema) => {
    startTransition(async () => {
      const result = await saveDonationEntryAction(values);
      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      if (selectedId === "new") {
        resetSelection("new");
      }
    });
  };

  const handleDelete = () => {
    if (!selectedDonation) {
      return;
    }

    startTransition(async () => {
      const result = await deleteDonationEntryAction(selectedDonation.id);
      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      resetSelection("new");
    });
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-br from-card via-card to-card/50 p-6 shadow-depth-lg backdrop-blur-sm">
      {/* Decorative Gradient Overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-rose-500/5 via-purple-500/5 to-blue-500/5" />

      <div className="relative space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500/20 to-purple-500/10 shadow-sm">
            <Sparkles className="size-5 text-rose-600" />
          </div>
          <div>
            <h2 className="font-heading text-lg font-semibold">Tambah / Edit Data Donasi</h2>
            <p className="text-sm text-muted-foreground">
              Catat donasi masuk secara manual dari panel ini
            </p>
          </div>
        </div>

        {campaigns.length > 0 ? (
          <>
            {/* Selection Section */}
            <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-muted/30 to-muted/10 p-5 backdrop-blur-sm">
              <FormFieldWrapper 
                label="Pilih Data Donasi" 
                hint="Pilih 'Tambah Baru' untuk mencatat donasi baru"
              >
                <Select value={selectedId} onValueChange={resetSelection}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih donasi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">+ Tambah Donasi Baru</SelectItem>
                    {donations.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.donorName} - {item.campaignTitle}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormFieldWrapper>
            </div>

            <form className="space-y-5" onSubmit={form.handleSubmit(handleSubmit)}>
              {/* Donor Info Section */}
              <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-muted/30 to-muted/10 p-5 backdrop-blur-sm">
                <div className="mb-4 flex items-center gap-2">
                  <User className="size-4 text-muted-foreground" />
                  <span className="text-sm font-semibold text-foreground">Informasi Donatur</span>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <FormFieldWrapper
                    label="Nama Donatur"
                    error={form.formState.errors.donorName?.message}
                  >
                    <Input placeholder="Nama lengkap donatur" {...form.register("donorName")} />
                  </FormFieldWrapper>
                  <FormFieldWrapper label="Program Donasi" error={form.formState.errors.campaignId?.message}>
                    <Select
                      value={selectedCampaignId || undefined}
                      onValueChange={(value) => {
                        if (value) {
                          form.setValue("campaignId", value);
                        }
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
                  <FormFieldWrapper label="Jumlah Donasi (Rp)" error={form.formState.errors.amount?.message}>
                    <Input type="number" placeholder="Contoh: 100000" {...form.register("amount", { valueAsNumber: true })} />
                  </FormFieldWrapper>
                  <FormFieldWrapper
                    label="Tanggal Donasi"
                    error={form.formState.errors.donatedAt?.message}
                  >
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
                        form.setValue(
                          "status",
                          (value ?? "PENDING") as DonationEntryFormSchema["status"],
                        )
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
                  <Textarea rows={3} placeholder="Catatan tambahan dari donatur atau pengurus..." {...form.register("note")} />
                </FormFieldWrapper>
              </div>

              <div className="flex flex-wrap gap-3">
                <ConfirmSubmitButton
                  title="Simpan data donasi?"
                  description="Perubahan akan memperbarui ringkasan donasi pada dashboard."
                  label="Simpan Donasi"
                  pendingLabel="Menyimpan..."
                  isPending={isPending}
                  onConfirm={() => form.handleSubmit(handleSubmit)()}
                />
                {selectedDonation ? (
                  <ConfirmDialog
                    title="Hapus data donasi?"
                    description="Data donasi yang dihapus juga akan memperbarui total terkumpul campaign terkait."
                    confirmLabel="Hapus Donasi"
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
          </>
        ) : (
          <EmptyState
            icon={HandCoins}
            title="Belum ada campaign donasi"
            description="Tambahkan campaign donasi terlebih dahulu agar pencatatan donatur bisa dilakukan dari dashboard."
          />
        )}
      </div>
    </div>
  );
}
