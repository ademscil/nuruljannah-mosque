"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Building2, Save, Loader2, MapPin, Phone, Mail, Globe } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FormFieldWrapper } from "@/components/shared/form-field-wrapper";
import { saveCmsSettingsAction } from "@/features/cms/services/cms-settings-actions";
import type { CmsSettingsRecord } from "@/features/cms/types/cms-settings";

const identitySchema = z.object({
  siteName: z.string().min(1, "Nama masjid wajib diisi"),
  siteShortName: z.string().min(1, "Nama pendek wajib diisi"),
  siteTagline: z.string().min(1, "Slogan / Tagline wajib diisi"),
  contactAddress: z.string().min(1, "Alamat lengkap wajib diisi"),
  contactCity: z.string().min(1, "Kota/Kabupaten wajib diisi"),
  contactPhone: z.string().min(1, "Nomor kontak telepon/WA wajib diisi"),
  contactEmail: z.string().email("Format email tidak valid"),
  contactMapUrl: z.string().url("Format link Google Maps tidak valid"),
});

type IdentityFormValues = z.infer<typeof identitySchema>;

interface MosqueIdentityFormProps {
  initialData: CmsSettingsRecord;
}

export function MosqueIdentityForm({ initialData }: MosqueIdentityFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<IdentityFormValues>({
    resolver: zodResolver(identitySchema),
    defaultValues: {
      siteName: initialData.siteName || "Masjid Nurul Jannah",
      siteShortName: initialData.siteShortName || "Nurul Jannah",
      siteTagline: initialData.siteTagline || "Pusat Ibadah dan Ukhuwah Islamiyah",
      contactAddress: initialData.contactAddress || "",
      contactCity: initialData.contactCity || "Pangkalpinang",
      contactPhone: initialData.contactPhone || "+6281234567890",
      contactEmail: initialData.contactEmail || "kontak@masjidnuruljannah.com",
      contactMapUrl: initialData.contactMapUrl || "https://maps.app.goo.gl/gnuQtg8XMpfbPKVs6",
    },
  });

  const onSubmit = (values: IdentityFormValues) => {
    startTransition(async () => {
      const result = await saveCmsSettingsAction({
        id: initialData.id,
        ...initialData,
        ...values,
      });

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success("Identitas & kontak masjid berhasil diperbarui!");
    });
  };

  return (
    <div className="bg-card text-card-foreground rounded-2xl border border-border/70 p-5 sm:p-7 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/60 mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Identitas Resmi & Kontak Masjid
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Pengaturan umum nama masjid, alamat fisik, dan nomor kontak yang tampil di footer portal.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <FormFieldWrapper
            label="Nama Resmi Masjid"
            error={form.formState.errors.siteName?.message}
          >
            <Input
              {...form.register("siteName")}
              placeholder="Masjid Nurul Jannah"
              className="h-11 text-sm font-medium"
            />
          </FormFieldWrapper>

          <FormFieldWrapper
            label="Nama Singkat / Panggilan"
            error={form.formState.errors.siteShortName?.message}
          >
            <Input
              {...form.register("siteShortName")}
              placeholder="Nurul Jannah"
              className="h-11 text-sm"
            />
          </FormFieldWrapper>

          <div className="sm:col-span-2">
            <FormFieldWrapper
              label="Slogan / Tagline Kemakmuran"
              error={form.formState.errors.siteTagline?.message}
            >
              <Input
                {...form.register("siteTagline")}
                placeholder="Pusat Ibadah, Dakwah, dan Ukhuwah Islamiyah"
                className="h-11 text-sm"
              />
            </FormFieldWrapper>
          </div>

          <div className="sm:col-span-2">
            <FormFieldWrapper
              label="Alamat Fisik Lengkap"
              error={form.formState.errors.contactAddress?.message}
            >
              <Textarea
                {...form.register("contactAddress")}
                placeholder="Jl. Merdeka No. 12, Kelurahan..."
                rows={2}
                className="text-sm resize-none"
              />
            </FormFieldWrapper>
          </div>

          <FormFieldWrapper
            label="Kota / Kabupaten"
            error={form.formState.errors.contactCity?.message}
          >
            <div className="relative">
              <Input
                {...form.register("contactCity")}
                placeholder="Pangkalpinang"
                className="h-11 text-sm pl-9"
              />
              <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
            </div>
          </FormFieldWrapper>

          <FormFieldWrapper
            label="Nomor Telepon / WhatsApp Sekretariat"
            error={form.formState.errors.contactPhone?.message}
          >
            <div className="relative">
              <Input
                {...form.register("contactPhone")}
                placeholder="+62 812-3456-7890"
                className="h-11 text-sm pl-9"
              />
              <Phone className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
            </div>
          </FormFieldWrapper>

          <FormFieldWrapper
            label="Email Resmi Masjid"
            error={form.formState.errors.contactEmail?.message}
          >
            <div className="relative">
              <Input
                {...form.register("contactEmail")}
                type="email"
                placeholder="sekretariat@masjidnuruljannah.com"
                className="h-11 text-sm pl-9"
              />
              <Mail className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
            </div>
          </FormFieldWrapper>

          <FormFieldWrapper
            label="Link Google Maps Resmi"
            error={form.formState.errors.contactMapUrl?.message}
          >
            <div className="relative">
              <Input
                {...form.register("contactMapUrl")}
                placeholder="https://maps.app.goo.gl/..."
                className="h-11 text-sm pl-9"
              />
              <Globe className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
            </div>
          </FormFieldWrapper>
        </div>

        <div className="flex items-center justify-end pt-6 border-t border-border/60">
          <Button
            type="submit"
            disabled={isPending}
            className="h-11 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl shadow-sm"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Simpan Identitas Masjid
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
