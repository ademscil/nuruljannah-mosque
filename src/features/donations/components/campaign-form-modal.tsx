"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, FileText, Target, Landmark, QrCode, ToggleLeft } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { FormFieldWrapper } from "@/components/shared/form-field-wrapper";
import { CurrencyInput } from "@/components/shared/currency-input";
import { SmartImageUploader } from "@/components/shared/smart-image-uploader";
import { useAutoSaveDraft } from "@/hooks/use-autosave-draft";
import { Button } from "@/components/ui/button";
import { Dialog, DialogOverlay, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { DialogClose, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  donationCampaignFormSchema,
  type DonationCampaignFormSchema,
} from "@/features/donations/schemas/donation-campaign-form-schema";
import { saveDonationCampaignAction } from "@/features/donations/services/donation-actions";
import type { DonationCampaignItem } from "@/features/donations/types/donation";
import { slugify } from "@/lib/slugify";

type CampaignFormModalProps = {
  campaign?: DonationCampaignItem;
  trigger?: React.ReactElement;
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

export function CampaignFormModal({ campaign, trigger }: CampaignFormModalProps) {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const form = useForm<DonationCampaignFormSchema>({
    resolver: zodResolver(donationCampaignFormSchema),
    defaultValues: getDefaultValues(campaign),
  });

  const formKey = campaign?.id ? ("draft_campaign_" + campaign.id) : "draft_campaign_new";
  const targetAmountValue = useWatch({ control: form.control, name: "targetAmount" });
  const collectedAmountValue = useWatch({ control: form.control, name: "collectedAmount" });
  const qrisImageUrlValue = useWatch({ control: form.control, name: "qrisImageUrl" });
  const { clearDraft } = useAutoSaveDraft({
    key: formKey,
    watch: form.watch,
    isDirty: form.formState.isDirty,
    onRestore: (saved) => {
      form.reset({ ...getDefaultValues(campaign), ...saved });
      toast.info("Draf program donasi berhasil dipulihkan.");
    },
  });

  const selectedActive = useWatch({ control: form.control, name: "isActive" });

  useEffect(() => {
    if (open) {
      form.reset(getDefaultValues(campaign));
    }
  }, [open, campaign, form]);

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
            <button {...props} onClick={() => setOpen(true)}>
              {trigger}
            </button>
          ) : (
            <Button {...props} onClick={() => setOpen(true)}>
              <Plus className="size-4" />
              Tambah Campaign
            </Button>
          )
        }
      />
      <DialogOverlay className="backdrop-blur-sm" />
      <DialogContent className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-border/50 bg-gradient-to-br from-background via-background to-background/95 p-0 shadow-depth-xl">
        <div className="sticky top-0 z-10 border-b border-border/50 bg-gradient-to-br from-card/95 via-card/90 to-card/95 px-6 py-5 backdrop-blur-md">
          <DialogTitle className="font-heading text-xl font-bold">
            {campaign ? "Edit Program Donasi" : "Tambah Program Donasi Baru"}
          </DialogTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            {campaign
              ? "Perbarui informasi program donasi yang sudah ada"
              : "Buat program donasi baru untuk ditampilkan di website"}
          </p>
        </div>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5 p-6">
          {/* Basic Info Section */}
          <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-muted/30 to-muted/10 p-5 backdrop-blur-sm">
            <div className="mb-4 flex items-center gap-2">
              <FileText className="size-4 text-muted-foreground" />
              <span className="text-sm font-semibold text-foreground">Informasi Program</span>
            </div>
            <div className="space-y-4">
              <FormFieldWrapper label="Nama Program Donasi" error={form.formState.errors.title?.message}>
                <Input placeholder="Contoh: Renovasi Atap Masjid" {...form.register("title")} />
              </FormFieldWrapper>
              <FormFieldWrapper
                label="Deskripsi Program"
                error={form.formState.errors.description?.message}
              >
                <Textarea
                  rows={4}
                  placeholder="Jelaskan tujuan dan manfaat program donasi ini..."
                  {...form.register("description")}
                />
              </FormFieldWrapper>
            </div>
          </div>

          {/* Target & Collection Section */}
          <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-muted/30 to-muted/10 p-5 backdrop-blur-sm">
            <div className="mb-4 flex items-center gap-2">
              <Target className="size-4 text-muted-foreground" />
              <span className="text-sm font-semibold text-foreground">Target & Dana Terkumpul</span>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <FormFieldWrapper
                label="Target Dana"
                error={form.formState.errors.targetAmount?.message}
                hint="Target total infaq/donasi yang dibutuhkan"
              >
                <CurrencyInput
                  value={targetAmountValue ?? 0}
                  onChange={(val) => form.setValue("targetAmount", val, { shouldValidate: true, shouldDirty: true })}
                  placeholder="Rp 0"
                />
              </FormFieldWrapper>
              <FormFieldWrapper
                label="Dana Terkumpul"
                error={form.formState.errors.collectedAmount?.message}
                hint="Total donasi yang sudah terhimpun saat ini"
              >
                <CurrencyInput
                  value={collectedAmountValue ?? 0}
                  onChange={(val) => form.setValue("collectedAmount", val, { shouldValidate: true, shouldDirty: true })}
                  placeholder="Rp 0"
                />
              </FormFieldWrapper>
            </div>
          </div>

          {/* Bank Account Section */}
          <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-muted/30 to-muted/10 p-5 backdrop-blur-sm">
            <div className="mb-4 flex items-center gap-2">
              <Landmark className="size-4 text-muted-foreground" />
              <span className="text-sm font-semibold text-foreground">Rekening Bank</span>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <FormFieldWrapper label="Nama Rekening Bank">
                <Input
                  placeholder="Contoh: BRI a.n. Masjid Nurul Jannah"
                  {...form.register("bankAccountName")}
                />
              </FormFieldWrapper>
              <FormFieldWrapper label="Nomor Rekening">
                <Input placeholder="Contoh: 1234-5678-9012" {...form.register("bankAccountNumber")} />
              </FormFieldWrapper>
            </div>
          </div>

          {/* QRIS Section */}
          <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-muted/30 to-muted/10 p-5 backdrop-blur-sm">
            <div className="mb-4 flex items-center gap-2">
              <QrCode className="size-4 text-muted-foreground" />
              <span className="text-sm font-semibold text-foreground">QRIS Digital</span>
            </div>
            <FormFieldWrapper
              label="Gambar Kode QRIS Digital (opsional)"
              error={form.formState.errors.qrisImageUrl?.message}
              hint="Otomatis dikonversi ke WebP ringan untuk kemudahan scan jamaah"
            >
              <SmartImageUploader
                value={qrisImageUrlValue ?? ""}
                onChange={(url) => form.setValue("qrisImageUrl", url, { shouldValidate: true, shouldDirty: true })}
                folder="qris"
                aspectRatio="1:1"
              />
            </FormFieldWrapper>
          </div>

          {/* Status Section */}
          <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-muted/30 to-muted/10 p-5 backdrop-blur-sm">
            <div className="mb-4 flex items-center gap-2">
              <ToggleLeft className="size-4 text-muted-foreground" />
              <span className="text-sm font-semibold text-foreground">Status Program</span>
            </div>
            <FormFieldWrapper
              label="Aktifkan program donasi"
              hint="Aktifkan agar program donasi ini tampil di website"
            >
              <div className="flex h-10 items-center gap-3 rounded-xl border border-border/50 bg-muted/20 px-3 backdrop-blur-sm">
                <Switch
                  checked={selectedActive}
                  onCheckedChange={(checked) => form.setValue("isActive", checked)}
                />
                <span className="text-sm text-muted-foreground">
                  {selectedActive ? "Aktif — tampil di website" : "Tidak aktif"}
                </span>
              </div>
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
              {isPending ? "Menyimpan..." : campaign ? "Simpan Perubahan" : "Tambah Campaign"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
