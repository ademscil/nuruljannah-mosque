"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Sparkles, Save, Loader2, ArrowRight } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FormFieldWrapper } from "@/components/shared/form-field-wrapper";
import { saveHomepageContentAction } from "@/features/cms/services/homepage-content-actions";
import type { HomepageContentRecord } from "@/features/cms/types/homepage-content";

const heroSchema = z.object({
  heroTitle: z.string().min(1, "Judul utama wajib diisi"),
  heroSubtitle: z.string().min(1, "Kalimat pembuka wajib diisi"),
  heroPrimaryCtaLabel: z.string().min(1, "Teks tombol aksi wajib diisi"),
  heroPrimaryCtaHref: z.string().min(1, "Link tujuan tombol wajib diisi"),
});

type HeroFormValues = z.infer<typeof heroSchema>;

interface HeroBannerFormProps {
  initialData: HomepageContentRecord;
}

export function HeroBannerForm({ initialData }: HeroBannerFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<HeroFormValues>({
    resolver: zodResolver(heroSchema),
    defaultValues: {
      heroTitle: initialData.heroTitle || "",
      heroSubtitle: initialData.heroSubtitle || "",
      heroPrimaryCtaLabel: initialData.heroPrimaryCtaLabel || "Lihat Agenda",
      heroPrimaryCtaHref: initialData.heroPrimaryCtaHref || "/agenda-kegiatan",
    },
  });

  const onSubmit = (values: HeroFormValues) => {
    startTransition(async () => {
      const result = await saveHomepageContentAction({
        id: initialData.id,
        ...values,
        welcomeTitle: initialData.welcomeTitle,
        welcomeContent: initialData.welcomeContent,
        donationCtaTitle: initialData.donationCtaTitle,
        donationCtaDescription: initialData.donationCtaDescription,
        featuredAnnouncementId: initialData.featuredAnnouncementId ?? undefined,
        featuredEventId: initialData.featuredEventId ?? undefined,
        status: initialData.status,
      });

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success("Banner utama beranda berhasil diperbarui!");
    });
  };

  return (
    <div className="bg-card text-card-foreground rounded-2xl border border-border/70 p-5 sm:p-7 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/60 mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Banner Utama (Hero Section)
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Bagian paling atas yang pertama kali disaksikan oleh jamaah saat mengunjungi portal.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6">
          <FormFieldWrapper
            label="Judul Utama Banner"
            error={form.formState.errors.heroTitle?.message}
            hint="Tuliskan nama masjid atau sambutan utama yang menonjol."
          >
            <Input
              {...form.register("heroTitle")}
              placeholder="Contoh: Masjid Nurul Jannah Pangkalpinang"
              className="h-12 text-base font-semibold"
            />
          </FormFieldWrapper>

          <FormFieldWrapper
            label="Kalimat Pembuka / Deskripsi Singkat"
            error={form.formState.errors.heroSubtitle?.message}
            hint="Penjelasan ringkas visi kemakmuran masjid atau ajakan ibadah (2–3 kalimat)."
          >
            <Textarea
              {...form.register("heroSubtitle")}
              placeholder="Contoh: Pusat ibadah, dakwah, dan pemberdayaan umat berbasis masjid yang inklusif dan amanah di Kota Pangkalpinang."
              rows={3}
              className="text-sm resize-none"
            />
          </FormFieldWrapper>

          <div className="pt-4 border-t border-border/50">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
              Tombol Aksi Utama (Call to Action)
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormFieldWrapper
                label="Teks Tombol"
                error={form.formState.errors.heroPrimaryCtaLabel?.message}
                hint="Label pada tombol yang menarik minat jamaah."
              >
                <Input
                  {...form.register("heroPrimaryCtaLabel")}
                  placeholder="Contoh: Lihat Jadwal Sholat"
                  className="h-11 text-sm"
                />
              </FormFieldWrapper>

              <FormFieldWrapper
                label="Link Tujuan"
                error={form.formState.errors.heroPrimaryCtaHref?.message}
                hint="Tautan halaman internal (contoh: /jadwal-sholat, /donasi)."
              >
                <div className="relative">
                  <Input
                    {...form.register("heroPrimaryCtaHref")}
                    placeholder="/agenda-kegiatan"
                    className="h-11 text-sm pl-9"
                  />
                  <ArrowRight className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                </div>
              </FormFieldWrapper>
            </div>
          </div>
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
                Menyimpan Perubahan...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Simpan Perubahan Banner
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
