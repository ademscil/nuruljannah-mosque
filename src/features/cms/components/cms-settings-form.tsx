"use client";

import { useTransition } from "react";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { ConfirmSubmitButton } from "@/components/shared/confirm-submit-button";
import { FormFieldWrapper } from "@/components/shared/form-field-wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { type CmsSettingsSchema } from "@/features/cms/schemas/cms-settings-schema";
import {
  saveCmsSettingsAction,
  uploadHeroVideoAction,
} from "@/features/cms/services/cms-settings-actions";
import type { CmsSettingsRecord } from "@/features/cms/types/cms-settings";

type CmsSettingsFormProps = {
  initialData: CmsSettingsRecord;
};

type CmsSettingsFormValues = CmsSettingsSchema & {
  heroVideoUrlText: string;
  profileSidebarItemsText: string;
  profileFacilitiesText: string;
  publicNavText: string;
  quickLinksText: string;
  homeStatsText: string;
  homeFeaturesText: string;
  homeServicesText: string;
  contentBlocksJson: string;
};

function splitLines(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function CmsSettingsForm({ initialData }: CmsSettingsFormProps) {
  const [isPending, startTransition] = useTransition();
  const [isUploadingVideo, startVideoUploadTransition] = useTransition();
  const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null);

  const form = useForm<CmsSettingsFormValues>({
    defaultValues: {
      ...initialData,
      heroVideoUrlText: initialData.contentBlocks.heroVideoUrl,
      profileSidebarItemsText: initialData.profileSidebarItems.join("\n"),
      profileFacilitiesText: initialData.profileFacilities.join("\n"),
      publicNavText: initialData.publicNav
        .map((item) => `${item.label}|${item.href}`)
        .join("\n"),
      quickLinksText: initialData.quickLinks
        .map((item) => `${item.title}|${item.description}|${item.href}`)
        .join("\n"),
      homeStatsText: initialData.contentBlocks.stats
        .map((item) => `${item.label}|${item.value}`)
        .join("\n"),
      homeFeaturesText: initialData.contentBlocks.features
        .map((item) => `${item.title}|${item.description}`)
        .join("\n"),
      homeServicesText: initialData.contentBlocks.services
        .map((item) => `${item.title}|${item.description}`)
        .join("\n"),
      contentBlocksJson: JSON.stringify(initialData.contentBlocks, null, 2),
    },
  });
  const heroVideoUrl = useWatch({
    control: form.control,
    name: "heroVideoUrlText",
  });


  const handleVideoUpload = (file: File | null) => {
    if (!file) {
      toast.error("Pilih file video dulu.");
      return;
    }

    startVideoUploadTransition(async () => {
      const uploadData = new FormData();
      uploadData.append("video", file);

      const result = await uploadHeroVideoAction(uploadData);
      if (!result.success || !result.url) {
        toast.error(result.message);
        return;
      }

      form.setValue("heroVideoUrlText", result.url, {
        shouldDirty: true,
        shouldValidate: true,
      });
      toast.success("Upload berhasil. Jangan lupa klik Simpan CMS Global.");
    });
  };

  const handleSubmit = (values: CmsSettingsFormValues) => {
    const payload: CmsSettingsSchema & { id?: string } = {
      id: initialData.id,
      siteName: values.siteName,
      siteShortName: values.siteShortName,
      siteTagline: values.siteTagline,
      contactAddress: values.contactAddress,
      contactCity: values.contactCity,
      contactEmail: values.contactEmail,
      contactPhone: values.contactPhone,
      contactMapUrl: values.contactMapUrl,
      homeFeatureTitle: values.homeFeatureTitle,
      homeFeatureDescription: values.homeFeatureDescription,
      homeServiceTitle: values.homeServiceTitle,
      homeServiceDescription: values.homeServiceDescription,
      homeCtaTitle: values.homeCtaTitle,
      homeCtaDescription: values.homeCtaDescription,
      profileTitle: values.profileTitle,
      profileDescription: values.profileDescription,
      profileSidebarTitle: values.profileSidebarTitle,
      profileSidebarDescription: values.profileSidebarDescription,
      profileSidebarItems: splitLines(values.profileSidebarItemsText),
      profileFacilities: splitLines(values.profileFacilitiesText),
      contactTitle: values.contactTitle,
      contactDescription: values.contactDescription,
      footerDescription: values.footerDescription,
      footerCopyright: values.footerCopyright,
      publicNav: splitLines(values.publicNavText).map((line) => {
        const [label, href] = line.split("|");
        return {
          label: (label ?? "").trim(),
          href: (href ?? "").trim(),
        };
      }),
      quickLinks: splitLines(values.quickLinksText).map((line) => {
        const [title, description, href] = line.split("|");
        return {
          title: (title ?? "").trim(),
          description: (description ?? "").trim(),
          href: (href ?? "").trim(),
        };
      }),
      contentBlocks: {
        ...initialData.contentBlocks, // Preserve all other contentBlocks properties
        heroVideoUrl: values.heroVideoUrlText.trim(),
        stats: splitLines(values.homeStatsText).map((line) => {
          const [label, value] = line.split("|");
          return { label: (label ?? "").trim(), value: (value ?? "").trim() };
        }),
        features: splitLines(values.homeFeaturesText).map((line) => {
          const [title, description] = line.split("|");
          return { title: (title ?? "").trim(), description: (description ?? "").trim() };
        }),
        services: splitLines(values.homeServicesText).map((line) => {
          const [title, description] = line.split("|");
          return { title: (title ?? "").trim(), description: (description ?? "").trim() };
        }),
      },
    };

    startTransition(async () => {
      const result = await saveCmsSettingsAction(payload);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
    });
  };

  return (
    <form className="space-y-6 card-hero p-7" onSubmit={form.handleSubmit(handleSubmit)}>
      <h2 className="text-xl font-semibold tracking-tight">CMS Global Components</h2>
      <p className="text-sm text-muted-foreground">
        Semua komponen publik bisa diatur di sini. Format khusus: menu `Label|/link` dan
        quick link `Judul|Deskripsi|/link`.
      </p>

      <div className="grid gap-5 md:grid-cols-2">
        <FormFieldWrapper label="Nama Situs" error={form.formState.errors.siteName?.message}>
          <Input {...form.register("siteName")} />
        </FormFieldWrapper>
        <FormFieldWrapper label="Nama Pendek" error={form.formState.errors.siteShortName?.message}>
          <Input {...form.register("siteShortName")} />
        </FormFieldWrapper>

        <FormFieldWrapper label="Tagline" error={form.formState.errors.siteTagline?.message} className="md:col-span-2">
          <Input {...form.register("siteTagline")} />
        </FormFieldWrapper>

        <FormFieldWrapper label="Alamat" error={form.formState.errors.contactAddress?.message} className="md:col-span-2">
          <Textarea rows={3} {...form.register("contactAddress")} />
        </FormFieldWrapper>

        <FormFieldWrapper label="Kota" error={form.formState.errors.contactCity?.message}>
          <Input {...form.register("contactCity")} />
        </FormFieldWrapper>
        <FormFieldWrapper label="Email" error={form.formState.errors.contactEmail?.message}>
          <Input {...form.register("contactEmail")} />
        </FormFieldWrapper>

        <FormFieldWrapper label="Telepon" error={form.formState.errors.contactPhone?.message}>
          <Input {...form.register("contactPhone")} />
        </FormFieldWrapper>
        <FormFieldWrapper label="Google Maps URL" error={form.formState.errors.contactMapUrl?.message}>
          <Input {...form.register("contactMapUrl")} />
        </FormFieldWrapper>

        <FormFieldWrapper
          label="Hero Video URL"
          hint="Gunakan URL video publik langsung (mp4/webm)."
        >
          <div className="space-y-3">
            <Input placeholder="https://..." {...form.register("heroVideoUrlText")} />
            <div className="rounded-xl border border-border/80 bg-muted/25 p-3">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Upload Video Hero
              </p>
              <div className="flex flex-col gap-2 md:flex-row md:items-center">
                <Input
                  type="file"
                  accept="video/mp4,video/webm"
                  onChange={(event) => {
                    const selectedFile = event.target.files?.[0] ?? null;
                    setSelectedVideoFile(selectedFile);
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  disabled={isUploadingVideo || !selectedVideoFile}
                  onClick={() => {
                    handleVideoUpload(selectedVideoFile);
                    setSelectedVideoFile(null);
                  }}
                >
                  {isUploadingVideo ? "Mengupload..." : "Upload Otomatis"}
                </Button>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Format: MP4/WEBM, maksimal 80MB.
              </p>
            </div>
          </div>
        </FormFieldWrapper>
        <div className="md:col-span-2 rounded-2xl border border-border bg-muted/30 p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Preview Video Hero
          </p>
          {heroVideoUrl ? (
            <video
              src={heroVideoUrl}
              autoPlay
              loop
              muted
              playsInline
              controls
              className="h-56 w-full rounded-xl object-cover"
            />
          ) : (
            <p className="text-sm text-muted-foreground">
              Isi URL video untuk melihat preview.
            </p>
          )}
        </div>

        <FormFieldWrapper label="Judul Fitur Beranda" error={form.formState.errors.homeFeatureTitle?.message}>
          <Input {...form.register("homeFeatureTitle")} />
        </FormFieldWrapper>
        <FormFieldWrapper label="Deskripsi Fitur Beranda" error={form.formState.errors.homeFeatureDescription?.message}>
          <Textarea rows={3} {...form.register("homeFeatureDescription")} />
        </FormFieldWrapper>

        <FormFieldWrapper label="Judul Layanan Beranda" error={form.formState.errors.homeServiceTitle?.message}>
          <Input {...form.register("homeServiceTitle")} />
        </FormFieldWrapper>
        <FormFieldWrapper label="Deskripsi Layanan Beranda" error={form.formState.errors.homeServiceDescription?.message}>
          <Textarea rows={3} {...form.register("homeServiceDescription")} />
        </FormFieldWrapper>

        <FormFieldWrapper label="Judul CTA Beranda" error={form.formState.errors.homeCtaTitle?.message}>
          <Input {...form.register("homeCtaTitle")} />
        </FormFieldWrapper>
        <FormFieldWrapper label="Deskripsi CTA Beranda" error={form.formState.errors.homeCtaDescription?.message}>
          <Textarea rows={3} {...form.register("homeCtaDescription")} />
        </FormFieldWrapper>

        <FormFieldWrapper label="Judul Halaman Profil" error={form.formState.errors.profileTitle?.message}>
          <Input {...form.register("profileTitle")} />
        </FormFieldWrapper>
        <FormFieldWrapper label="Deskripsi Halaman Profil" error={form.formState.errors.profileDescription?.message}>
          <Textarea rows={3} {...form.register("profileDescription")} />
        </FormFieldWrapper>

        <FormFieldWrapper label="Judul Sidebar Profil" error={form.formState.errors.profileSidebarTitle?.message}>
          <Input {...form.register("profileSidebarTitle")} />
        </FormFieldWrapper>
        <FormFieldWrapper label="Deskripsi Sidebar Profil" error={form.formState.errors.profileSidebarDescription?.message}>
          <Textarea rows={3} {...form.register("profileSidebarDescription")} />
        </FormFieldWrapper>

        <FormFieldWrapper label="Item Sidebar Profil (1 baris 1 item)" className="md:col-span-2">
          <Textarea rows={5} {...form.register("profileSidebarItemsText")} />
        </FormFieldWrapper>

        <FormFieldWrapper label="Fasilitas Profil (1 baris 1 item)" className="md:col-span-2">
          <Textarea rows={5} {...form.register("profileFacilitiesText")} />
        </FormFieldWrapper>

        <FormFieldWrapper label="Judul Halaman Kontak" error={form.formState.errors.contactTitle?.message}>
          <Input {...form.register("contactTitle")} />
        </FormFieldWrapper>
        <FormFieldWrapper label="Deskripsi Halaman Kontak" error={form.formState.errors.contactDescription?.message}>
          <Textarea rows={3} {...form.register("contactDescription")} />
        </FormFieldWrapper>

        <FormFieldWrapper label="Deskripsi Footer" error={form.formState.errors.footerDescription?.message} className="md:col-span-2">
          <Textarea rows={3} {...form.register("footerDescription")} />
        </FormFieldWrapper>

        <FormFieldWrapper label="Copyright Footer" error={form.formState.errors.footerCopyright?.message} className="md:col-span-2">
          <Input {...form.register("footerCopyright")} />
        </FormFieldWrapper>

        <FormFieldWrapper label="Menu Header Publik (Label|/link)" className="md:col-span-2">
          <Textarea rows={6} {...form.register("publicNavText")} />
        </FormFieldWrapper>

        <FormFieldWrapper label="Quick Links Beranda (Judul|Deskripsi|/link)" className="md:col-span-2">
          <Textarea rows={6} {...form.register("quickLinksText")} />
        </FormFieldWrapper>

        <FormFieldWrapper label="Stat Beranda (Label|Nilai)" className="md:col-span-2">
          <Textarea rows={4} {...form.register("homeStatsText")} />
        </FormFieldWrapper>

        <FormFieldWrapper label="Card Fitur Beranda (Judul|Deskripsi)" className="md:col-span-2">
          <Textarea rows={6} {...form.register("homeFeaturesText")} />
        </FormFieldWrapper>

        <FormFieldWrapper label="Card Layanan Beranda (Judul|Deskripsi)" className="md:col-span-2">
          <Textarea rows={6} {...form.register("homeServicesText")} />
        </FormFieldWrapper>
      </div>

      <ConfirmSubmitButton
        title="Simpan pengaturan CMS global?"
        description="Perubahan ini dipakai di banyak komponen publik dan admin."
        label="Simpan CMS Global"
        pendingLabel="Menyimpan..."
        isPending={isPending}
        onConfirm={() => form.handleSubmit(handleSubmit)()}
      />
    </form>
  );
}
