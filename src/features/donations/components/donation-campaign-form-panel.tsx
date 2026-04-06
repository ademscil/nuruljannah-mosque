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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  donationCampaignFormSchema,
  type DonationCampaignFormSchema,
} from "@/features/donations/schemas/donation-campaign-form-schema";
import {
  deleteDonationCampaignAction,
  saveDonationCampaignAction,
} from "@/features/donations/services/donation-actions";
import type { DonationCampaignItem } from "@/features/donations/types/donation";
import { slugify } from "@/lib/slugify";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type DonationCampaignFormPanelProps = {
  campaigns: DonationCampaignItem[];
};

function getDefaultValues(campaign?: DonationCampaignItem): DonationCampaignFormSchema {
  return {
    id: campaign?.id,
    title: campaign?.title ?? "",
    slug: campaign?.slug ?? "",
    description: campaign?.description ?? "",
    targetAmount: campaign?.targetAmount ?? 0,
    collectedAmount: campaign?.collectedAmount ?? 0,
    bankAccountName: campaign?.bankAccountName ?? "",
    bankAccountNumber: campaign?.bankAccountNumber ?? "",
    qrisImageUrl: campaign?.qrisImageUrl ?? "",
    isActive: campaign?.isActive ?? true,
  };
}

export function DonationCampaignFormPanel({
  campaigns,
}: DonationCampaignFormPanelProps) {
  const [selectedId, setSelectedId] = useState("new");
  const [isPending, startTransition] = useTransition();
  const selectedCampaign = useMemo(
    () => campaigns.find((item) => item.id === selectedId),
    [campaigns, selectedId],
  );

  const form = useForm<DonationCampaignFormSchema>({
    resolver: zodResolver(donationCampaignFormSchema),
    defaultValues: getDefaultValues(),
  });
  const selectedActive = useWatch({
    control: form.control,
    name: "isActive",
  });

  const resetSelection = (id: string | null) => {
    if (!id) {
      return;
    }

    setSelectedId(id);
    const campaign = campaigns.find((item) => item.id === id);
    form.reset(getDefaultValues(campaign));
  };

  const handleSubmit = (values: DonationCampaignFormSchema) => {
    startTransition(async () => {
      const result = await saveDonationCampaignAction({
        ...values,
        slug: values.slug || slugify(values.title),
      });
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      toast.success(result.message);
      if (selectedId === "new") resetSelection("new");
    });
  };

  const handleDelete = () => {
    if (!selectedCampaign) {
      return;
    }

    startTransition(async () => {
      const result = await deleteDonationCampaignAction(selectedCampaign.id);
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
          <h2 className="text-lg font-semibold tracking-tight">Tambah / Edit Program Donasi</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Pilih program yang ingin diedit, atau buat program donasi baru.
          </p>
        </div>
        <FormFieldWrapper label="Pilih Program Donasi" hint="Pilih 'Tambah Baru' untuk membuat program baru">
          <Select value={selectedId} onValueChange={resetSelection}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih program donasi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">+ Tambah Program Donasi Baru</SelectItem>
              {campaigns.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormFieldWrapper>
      </div>
      <form className="mt-6 space-y-5" onSubmit={form.handleSubmit(handleSubmit)}>
        <FormFieldWrapper label="Nama Program Donasi" error={form.formState.errors.title?.message}>
          <Input placeholder="Contoh: Renovasi Atap Masjid" {...form.register("title")} />
        </FormFieldWrapper>
        <FormFieldWrapper
          label="Deskripsi Program"
          error={form.formState.errors.description?.message}
        >
          <Textarea rows={4} placeholder="Jelaskan tujuan dan manfaat program donasi ini..." {...form.register("description")} />
        </FormFieldWrapper>
        <div className="grid gap-5 md:grid-cols-2">
          <FormFieldWrapper
            label="Target Dana (Rp)"
            error={form.formState.errors.targetAmount?.message}
          >
            <Input type="number" placeholder="Contoh: 50000000" {...form.register("targetAmount", { valueAsNumber: true })} />
          </FormFieldWrapper>
          <FormFieldWrapper
            label="Dana Terkumpul (Rp)"
            hint="Perbarui sesuai total donasi yang sudah masuk"
          >
            <Input
              type="number"
              placeholder="0"
              {...form.register("collectedAmount", { valueAsNumber: true })}
            />
          </FormFieldWrapper>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <FormFieldWrapper label="Nama Rekening Bank">
            <Input placeholder="Contoh: BRI a.n. Masjid Nurul Jannah" {...form.register("bankAccountName")} />
          </FormFieldWrapper>
          <FormFieldWrapper label="Nomor Rekening">
            <Input placeholder="Contoh: 1234-5678-9012" {...form.register("bankAccountNumber")} />
          </FormFieldWrapper>
        </div>
        <FormFieldWrapper
          label="Link Gambar QRIS (opsional)"
          error={form.formState.errors.qrisImageUrl?.message}
          hint="Tempel link gambar kode QRIS untuk donasi digital"
        >
          <Input placeholder="https://drive.google.com/..." {...form.register("qrisImageUrl")} />
        </FormFieldWrapper>
        <FormFieldWrapper
          label="Status Program"
          hint="Aktifkan agar program donasi ini tampil di website"
        >
          <div className="flex h-10 items-center gap-3 rounded-xl border border-border px-3">
            <Switch
              checked={selectedActive}
              onCheckedChange={(checked) => form.setValue("isActive", checked)}
            />
            <span className="text-sm text-muted-foreground">{selectedActive ? "Aktif — tampil di website" : "Tidak aktif"}</span>
          </div>
        </FormFieldWrapper>
        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={isPending} className="button-brand">
            {isPending ? (
              <>
                <LoaderCircle className="size-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              "Simpan Campaign"
            )}
          </Button>
          {selectedCampaign ? (
            <ConfirmDialog
              title="Hapus campaign donasi?"
              description="Campaign yang dihapus juga akan menghapus riwayat donasi yang terhubung dengannya."
              confirmLabel="Hapus Campaign"
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
