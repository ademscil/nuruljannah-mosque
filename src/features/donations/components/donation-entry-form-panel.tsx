"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { HandCoins, LoaderCircle, Trash2 } from "lucide-react";
import { useMemo, useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/shared/confirm-dialog";
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
    <div className="card-elevated p-6">
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Tambah / Edit Data Donasi</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Catat donasi masuk secara manual dari panel ini.
          </p>
        </div>

        {campaigns.length > 0 ? (
          <FormFieldWrapper label="Pilih Data Donasi" hint="Pilih 'Tambah Baru' untuk mencatat donasi baru">
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
        ) : (
          <EmptyState
            icon={HandCoins}
            title="Belum ada campaign donasi"
            description="Tambahkan campaign donasi terlebih dahulu agar pencatatan donatur bisa dilakukan dari dashboard."
          />
        )}
      </div>

      {campaigns.length > 0 ? (
        <form className="mt-6 space-y-5" onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="grid gap-5 md:grid-cols-2">
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

          <div className="grid gap-5 md:grid-cols-2">
            <FormFieldWrapper label="Email (opsional)">
              <Input type="email" placeholder="email@contoh.com" {...form.register("donorEmail")} />
            </FormFieldWrapper>
            <FormFieldWrapper label="Nomor HP (opsional)">
              <Input placeholder="08xxxxxxxxxx" {...form.register("donorPhone")} />
            </FormFieldWrapper>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
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

          <FormFieldWrapper label="Catatan (opsional)">
            <Textarea rows={3} placeholder="Catatan tambahan dari donatur atau pengurus..." {...form.register("note")} />
          </FormFieldWrapper>

          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={isPending} className="button-brand">
              {isPending ? (
                <>
                  <LoaderCircle className="size-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Simpan Donasi"
              )}
            </Button>
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
      ) : null}
    </div>
  );
}
