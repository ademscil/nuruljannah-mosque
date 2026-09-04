"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Heart, Save, Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FormFieldWrapper } from "@/components/shared/form-field-wrapper";
import { saveHomepageContentAction } from "@/features/cms/services/homepage-content-actions";
import type { HomepageContentRecord } from "@/features/cms/types/homepage-content";

const donationSchema = z.object({
  donationCtaTitle: z.string().min(1, "Judul ajakan donasi wajib diisi"),
  donationCtaDescription: z.string().min(1, "Deskripsi ajakan donasi wajib diisi"),
});

type DonationFormValues = z.infer<typeof donationSchema>;

interface DonationCtaFormProps {
  initialData: HomepageContentRecord;
}

export function DonationCtaForm({ initialData }: DonationCtaFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<DonationFormValues>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      donationCtaTitle: initialData.donationCtaTitle || "Salurkan Infaq & Sedekah Terbaik Anda",
      donationCtaDescription: initialData.donationCtaDescription || "",
    },
  });

  const onSubmit = (values: DonationFormValues) => {
    startTransition(async () => {
      const result = await saveHomepageContentAction({
        id: initialData.id,
        heroTitle: initialData.heroTitle,
        heroSubtitle: initialData.heroSubtitle,
        heroPrimaryCtaLabel: initialData.heroPrimaryCtaLabel,
        heroPrimaryCtaHref: initialData.heroPrimaryCtaHref,
        welcomeTitle: initialData.welcomeTitle,
        welcomeContent: initialData.welcomeContent,
        ...values,
        featuredAnnouncementId: initialData.featuredAnnouncementId ?? undefined,
        featuredEventId: initialData.featuredEventId ?? undefined,
        status: initialData.status,
      });

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success("Informasi ajakan donasi berhasil disimpan!");
    });
  };

  return (
    <div className="bg-card text-card-foreground rounded-2xl border border-border/70 p-5 sm:p-7 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/60 mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
            <Heart className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Seksi Ajakan Donasi & Infaq
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Blok informasi pada beranda yang mengajak jamaah menyisihkan sebagian rezeki untuk operasional dan kemaslahatan masjid.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6">
          <FormFieldWrapper
            label="Judul Ajakan Donasi"
            error={form.formState.errors.donationCtaTitle?.message}
            hint="Contoh: Bersama Memakmurkan Rumah Allah di Bumi Bangka"
          >
            <Input
              {...form.register("donationCtaTitle")}
              placeholder="Salurkan Infaq & Sedekah Terbaik Anda"
              className="h-12 text-base font-semibold"
            />
          </FormFieldWrapper>

          <FormFieldWrapper
            label="Uraian Ajakan Donasi"
            error={form.formState.errors.donationCtaDescription?.message}
            hint="Jelaskan transparansi dan program-program yang dibiayai oleh donasi jamaah."
          >
            <Textarea
              {...form.register("donationCtaDescription")}
              placeholder="Setiap rupiah yang Anda infaqkan menjadi amal jariyah untuk santunan anak yatim, renovasi fasilitas, dan program dakwah."
              rows={4}
              className="text-sm leading-relaxed"
            />
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
                Simpan Seksi Donasi
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
