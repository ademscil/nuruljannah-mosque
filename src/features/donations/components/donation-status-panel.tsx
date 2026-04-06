"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { HandCoins, LoaderCircle } from "lucide-react";
import { useMemo, useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { EmptyState } from "@/components/shared/empty-state";
import { FormFieldWrapper } from "@/components/shared/form-field-wrapper";
import { Button } from "@/components/ui/button";
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
    <div className="card-elevated p-6">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">Verifikasi Donasi</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Konfirmasi donasi masuk atau tandai transaksi yang dibatalkan.
        </p>
      </div>

      {donations.length > 0 ? (
        <form className="mt-6 space-y-5" onSubmit={form.handleSubmit(handleSubmit)}>
          <FormFieldWrapper label="Pilih Donasi">
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

          <FormFieldWrapper label="Status Verifikasi" hint="Ubah ke 'Terkonfirmasi' setelah dana diterima">
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

          <FormFieldWrapper label="Catatan (opsional)">
            <Textarea rows={3} placeholder="Catatan verifikasi dari bendahara..." {...form.register("note")} />
          </FormFieldWrapper>

          <Button type="submit" disabled={isPending} className="button-brand">
            {isPending ? (
              <>
                <LoaderCircle className="size-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              "Simpan Status Donasi"
            )}
          </Button>
        </form>
      ) : (
        <div className="mt-6">
          <EmptyState
            icon={HandCoins}
            title="Belum ada data donasi"
            description="Tambahkan donasi manual dari panel di samping agar bendahara bisa mulai memverifikasi transaksi."
          />
        </div>
      )}
    </div>
  );
}
