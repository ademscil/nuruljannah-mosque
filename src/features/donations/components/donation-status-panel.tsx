"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { HandCoins, Sparkles, CheckCircle2, Clock, XCircle } from "lucide-react";
import { useMemo, useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { EmptyState } from "@/components/shared/empty-state";
import { ConfirmSubmitButton } from "@/components/shared/confirm-submit-button";
import { FormFieldWrapper } from "@/components/shared/form-field-wrapper";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  donationStatusFormSchema,
  type DonationStatusFormSchema,
} from "@/features/donations/schemas/donation-campaign-form-schema";
import { updateDonationStatusAction } from "@/features/donations/services/donation-actions";
import type { DonationListItem } from "@/features/donations/types/donation";

type DonationStatusPanelProps = {
  donations: DonationListItem[];
};

function getDefaultValues(donation?: DonationListItem): DonationStatusFormSchema {
  return {
    id: donation?.id ?? "",
    status: donation?.status ?? "PENDING",
    note: donation?.note ?? "",
  };
}

export function DonationStatusPanel({ donations }: DonationStatusPanelProps) {
  const [selectedId, setSelectedId] = useState(donations[0]?.id ?? "");
  const [isPending, startTransition] = useTransition();

  const selectedDonation = useMemo(
    () => donations.find((item) => item.id === selectedId),
    [donations, selectedId],
  );

  const form = useForm<DonationStatusFormSchema>({
    resolver: zodResolver(donationStatusFormSchema),
    defaultValues: getDefaultValues(selectedDonation),
  });
  const selectedStatus = useWatch({
    control: form.control,
    name: "status",
  });

  const handleSelect = (id: string | null) => {
    if (!id) {
      return;
    }

    setSelectedId(id);
    const donation = donations.find((item) => item.id === id);
    form.reset(getDefaultValues(donation));
  };

  const handleSubmit = (values: DonationStatusFormSchema) => {
    startTransition(async () => {
      const result = await updateDonationStatusAction(values);
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      toast.success(result.message);
    });
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-br from-card via-card to-card/50 p-6 shadow-depth-lg backdrop-blur-sm">
      {/* Decorative Gradient Overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-blue-500/5 to-purple-500/5" />

      <div className="relative space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/20 to-blue-500/10 shadow-sm">
            <Sparkles className="size-5 text-emerald-600" />
          </div>
          <div>
            <h2 className="font-heading text-lg font-semibold">Verifikasi Donasi</h2>
            <p className="text-sm text-muted-foreground">
              Konfirmasi donasi masuk atau tandai transaksi yang dibatalkan
            </p>
          </div>
        </div>

        {donations.length > 0 ? (
          <form className="space-y-5" onSubmit={form.handleSubmit(handleSubmit)}>
            {/* Selection Section */}
            <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-muted/30 to-muted/10 p-5 backdrop-blur-sm">
              <div className="mb-2 flex items-center gap-2">
                <HandCoins className="size-4 text-muted-foreground" />
                <span className="text-sm font-semibold text-foreground">Pilih Donasi</span>
              </div>
              <FormFieldWrapper label="Donasi yang akan diverifikasi">
                <Select value={selectedId} onValueChange={handleSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih donasi" />
                  </SelectTrigger>
                  <SelectContent>
                    {donations.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.donorName} - {item.campaignTitle}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormFieldWrapper>
            </div>

            {/* Status Section */}
            <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-muted/30 to-muted/10 p-5 backdrop-blur-sm">
              <div className="mb-2 flex items-center gap-2">
                {selectedStatus === "CONFIRMED" ? (
                  <CheckCircle2 className="size-4 text-emerald-600" />
                ) : selectedStatus === "CANCELLED" ? (
                  <XCircle className="size-4 text-rose-600" />
                ) : (
                  <Clock className="size-4 text-amber-600" />
                )}
                <span className="text-sm font-semibold text-foreground">Status Verifikasi</span>
              </div>
              <FormFieldWrapper 
                label="Ubah status donasi" 
                hint="Ubah ke 'Terkonfirmasi' setelah dana diterima"
              >
                <Select
                  value={selectedStatus}
                  onValueChange={(value) =>
                    form.setValue(
                      "status",
                      (value ?? "PENDING") as DonationStatusFormSchema["status"],
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

            {/* Notes Section */}
            <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-muted/30 to-muted/10 p-5 backdrop-blur-sm">
              <FormFieldWrapper label="Catatan (opsional)">
                <Textarea 
                  rows={3} 
                  placeholder="Catatan verifikasi dari bendahara..." 
                  {...form.register("note")} 
                />
              </FormFieldWrapper>
            </div>

            <ConfirmSubmitButton
              title="Simpan status donasi?"
              description="Status donasi ini akan memengaruhi laporan dan progres campaign."
              label="Simpan Status Donasi"
              pendingLabel="Menyimpan..."
              isPending={isPending}
              onConfirm={() => form.handleSubmit(handleSubmit)()}
            />
          </form>
        ) : (
          <EmptyState
            icon={HandCoins}
            title="Belum ada data donasi"
            description="Tambahkan donasi manual dari panel di samping agar bendahara bisa mulai memverifikasi transaksi."
          />
        )}
      </div>
    </div>
  );
}
