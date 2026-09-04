"use client";

import { useTransition, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { Settings, Save, Building2, Phone, Mail, MapPin, Video, Info } from "lucide-react";

import { ConfirmSubmitButton } from "@/components/shared/confirm-submit-button";
import { FormFieldWrapper } from "@/components/shared/form-field-wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  saveCmsSettingsAction,
  uploadHeroVideoAction,
} from "@/features/cms/services/cms-settings-actions";
import type { CmsSettingsRecord } from "@/features/cms/types/cms-settings";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

type GlobalSettingsFormValues = {
  siteName: string;
  siteShortName: string;
  siteTagline: string;
  contactAddress: string;
  contactCity: string;
  contactEmail: string;
  contactPhone: string;
  contactMapUrl: string;
  heroVideoUrl: string;
};

type GlobalSettingsFormProps = {
  initialData: CmsSettingsRecord;
};

export function GlobalSettingsForm({ initialData }: GlobalSettingsFormProps) {
  const [isPending, startTransition] = useTransition();
  const [isUploadingVideo, startVideoUploadTransition] = useTransition();
  const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null);

  const form = useForm<GlobalSettingsFormValues>({
    defaultValues: {
      siteName: initialData.siteName,
      siteShortName: initialData.siteShortName,
      siteTagline: initialData.siteTagline,
      contactAddress: initialData.contactAddress,
      contactCity: initialData.contactCity,
      contactEmail: initialData.contactEmail,
      contactPhone: initialData.contactPhone,
      contactMapUrl: initialData.contactMapUrl,
      heroVideoUrl: initialData.contentBlocks.heroVideoUrl,
    },
  });

  const heroVideoUrl = useWatch({ control: form.control, name: "heroVideoUrl" });

  const handleVideoUpload = (file: File | null) => {
    if (!file) {
      toast.error("Pilih file video terlebih dahulu");
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

      form.setValue("heroVideoUrl", result.url, { shouldDirty: true });
      toast.success("Video berhasil diupload! Jangan lupa klik Simpan.");
      setSelectedVideoFile(null);
    });
  };

  const handleSubmit = (values: GlobalSettingsFormValues) => {
    startTransition(async () => {
      const payload = {
        id: initialData.id,
        siteName: values.siteName,
        siteShortName: values.siteShortName,
        siteTagline: values.siteTagline,
        contactAddress: values.contactAddress,
        contactCity: values.contactCity,
        contactEmail: values.contactEmail,
        contactPhone: values.contactPhone,
        contactMapUrl: values.contactMapUrl,
        // Keep all other existing fields
        homeFeatureTitle: initialData.homeFeatureTitle,
        homeFeatureDescription: initialData.homeFeatureDescription,
        homeServiceTitle: initialData.homeServiceTitle,
        homeServiceDescription: initialData.homeServiceDescription,
        homeCtaTitle: initialData.homeCtaTitle,
        homeCtaDescription: initialData.homeCtaDescription,
        profileTitle: initialData.profileTitle,
        profileDescription: initialData.profileDescription,
        profileSidebarTitle: initialData.profileSidebarTitle,
        profileSidebarDescription: initialData.profileSidebarDescription,
        profileSidebarItems: initialData.profileSidebarItems,
        profileFacilities: initialData.profileFacilities,
        contactTitle: initialData.contactTitle,
        contactDescription: initialData.contactDescription,
        footerDescription: initialData.footerDescription,
        footerCopyright: initialData.footerCopyright,
        publicNav: initialData.publicNav,
        quickLinks: initialData.quickLinks,
        contentBlocks: {
          ...initialData.contentBlocks,
          heroVideoUrl: values.heroVideoUrl,
        },
      };

      const result = await saveCmsSettingsAction(payload);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success("Pengaturan global berhasil diperbarui! 🎉");
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Info Banner */}
      <div className="glass-frosted rounded-2xl p-6 shadow-depth-md border-l-4 border-primary">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 flex-shrink-0">
            <Info className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-1">Pengaturan Global Website</h3>
            <p className="text-sm text-muted-foreground">
              Informasi di halaman ini akan digunakan di seluruh website masjid. Pastikan data yang diisi akurat dan up-to-date.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Accordion className="space-y-4">
          {/* Informasi Masjid */}
          <AccordionItem value="info" className="card-3d-advanced glass-ultra rounded-3xl border-0 shadow-depth-lg overflow-hidden">
            <AccordionTrigger className="px-8 py-6 hover:no-underline">
              <div className="flex items-center gap-4 text-left">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Informasi Masjid</h3>
                  <p className="text-sm text-muted-foreground">Nama dan tagline masjid</p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-8 pb-6">
              <div className="grid gap-5 md:grid-cols-2 pt-2">
                <FormFieldWrapper
                  label="Nama Lengkap Masjid"
                  hint="Nama resmi masjid"
                >
                  <Input
                    {...form.register("siteName")}
                    placeholder="Contoh: Masjid Nurul Jannah"
                    className="h-11"
                  />
                </FormFieldWrapper>

                <FormFieldWrapper
                  label="Nama Singkat"
                  hint="Untuk tampilan mobile"
                >
                  <Input
                    {...form.register("siteShortName")}
                    placeholder="Contoh: Nurul Jannah"
                    className="h-11"
                  />
                </FormFieldWrapper>

                <FormFieldWrapper
                  label="Tagline / Motto"
                  className="md:col-span-2"
                  hint="Kalimat singkat yang menggambarkan masjid"
                >
                  <Input
                    {...form.register("siteTagline")}
                    placeholder="Contoh: Memakmurkan Rumah Allah, Membangun Ukhuwah Islamiyah"
                    className="h-11"
                  />
                </FormFieldWrapper>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Kontak & Lokasi */}
          <AccordionItem value="contact" className="card-3d-advanced glass-ultra rounded-3xl border-0 shadow-depth-lg overflow-hidden">
            <AccordionTrigger className="px-8 py-6 hover:no-underline">
              <div className="flex items-center gap-4 text-left">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10">
                  <Phone className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Kontak & Lokasi</h3>
                  <p className="text-sm text-muted-foreground">Informasi yang bisa dihubungi jamaah</p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-8 pb-6">
              <div className="grid gap-5 md:grid-cols-2 pt-2">
                <FormFieldWrapper
                  label="Alamat Lengkap"
                  className="md:col-span-2"
                  hint="Alamat jalan, nomor, RT/RW"
                >
                  <Textarea
                    {...form.register("contactAddress")}
                    rows={3}
                    placeholder="Contoh: Jl. Raya No. 123, RT 01/RW 02"
                    className="resize-none"
                  />
                </FormFieldWrapper>

                <FormFieldWrapper
                  label="Kota / Kabupaten"
                  hint="Lokasi masjid berada"
                >
                  <Input
                    {...form.register("contactCity")}
                    placeholder="Contoh: Bandung"
                    className="h-11"
                  />
                </FormFieldWrapper>

                <FormFieldWrapper
                  label="Nomor Telepon"
                  hint="Nomor yang bisa dihubungi"
                >
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <Input
                      {...form.register("contactPhone")}
                      placeholder="Contoh: 0812-3456-7890"
                      className="h-11"
                    />
                  </div>
                </FormFieldWrapper>

                <FormFieldWrapper
                  label="Email Masjid"
                  hint="Email untuk komunikasi resmi"
                >
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <Input
                      {...form.register("contactEmail")}
                      type="email"
                      placeholder="Contoh: info@masjidnuruljannah.or.id"
                      className="h-11"
                    />
                  </div>
                </FormFieldWrapper>

                <FormFieldWrapper
                  label="Link Google Maps"
                  hint="URL embed map dari Google Maps"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <Input
                      {...form.register("contactMapUrl")}
                      placeholder="https://maps.google.com/..."
                      className="h-11 font-mono text-xs"
                    />
                  </div>
                </FormFieldWrapper>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Video Hero */}
          <AccordionItem value="video" className="card-3d-advanced glass-ultra rounded-3xl border-0 shadow-depth-lg overflow-hidden">
            <AccordionTrigger className="px-8 py-6 hover:no-underline">
              <div className="flex items-center gap-4 text-left">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10">
                  <Video className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Video Banner</h3>
                  <p className="text-sm text-muted-foreground">Video latar belakang di halaman utama</p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-8 pb-6">
              <div className="space-y-5 pt-2">
                <FormFieldWrapper
                  label="URL Video"
                  hint="Link video yang sudah di-upload (format MP4 atau WEBM)"
                >
                  <Input
                    {...form.register("heroVideoUrl")}
                    placeholder="https://..."
                    className="h-11 font-mono text-sm"
                  />
                </FormFieldWrapper>

                <div className="rounded-2xl border border-border bg-muted/30 p-5">
                  <p className="text-sm font-semibold mb-3">Upload Video Baru</p>
                  <div className="flex flex-col gap-3 md:flex-row md:items-end">
                    <div className="flex-1">
                      <Input
                        type="file"
                        accept="video/mp4,video/webm"
                        onChange={(e) => setSelectedVideoFile(e.target.files?.[0] || null)}
                        className="h-11"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      disabled={isUploadingVideo || !selectedVideoFile}
                      onClick={() => handleVideoUpload(selectedVideoFile)}
                      className="h-11"
                    >
                      {isUploadingVideo ? "Mengupload..." : "Upload Video"}
                    </Button>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Format: MP4/WEBM, maksimal 80MB. Video akan otomatis di-upload ke server.
                  </p>
                </div>

                {heroVideoUrl && (
                  <div className="rounded-2xl border border-border bg-muted/20 p-4">
                    <p className="text-xs font-semibold mb-3 uppercase tracking-wider text-muted-foreground">
                      Preview Video
                    </p>
                    <video
                      src={heroVideoUrl}
                      autoPlay
                      loop
                      muted
                      playsInline
                      controls
                      className="w-full h-64 rounded-xl object-cover shadow-depth-md"
                    />
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Submit Button */}
        <div className="card-3d-advanced glass-ultra rounded-3xl p-8 shadow-depth-lg">
          <ConfirmSubmitButton
            title="Simpan perubahan pengaturan global?"
            description="Perubahan ini akan mempengaruhi tampilan di seluruh website. Pastikan data sudah benar."
            label="Simpan Pengaturan Global"
            pendingLabel="Menyimpan..."
            isPending={isPending}
            onConfirm={() => form.handleSubmit(handleSubmit)()}
          />
        </div>
      </form>
    </div>
  );
}
