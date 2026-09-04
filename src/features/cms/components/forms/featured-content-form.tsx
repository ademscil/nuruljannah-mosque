"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { BookmarkCheck, Save, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FormFieldWrapper } from "@/components/shared/form-field-wrapper";
import { saveHomepageContentAction } from "@/features/cms/services/homepage-content-actions";
import type { HomepageContentRecord } from "@/features/cms/types/homepage-content";

const featuredSchema = z.object({
  featuredAnnouncementId: z.string().optional(),
  featuredEventId: z.string().optional(),
});

type FeaturedFormValues = z.infer<typeof featuredSchema>;

interface FeaturedContentFormProps {
  initialData: HomepageContentRecord;
  announcementOptions: Array<{ id: string; label: string }>;
  eventOptions: Array<{ id: string; label: string }>;
}

export function FeaturedContentForm({
  initialData,
  announcementOptions,
  eventOptions,
}: FeaturedContentFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<FeaturedFormValues>({
    resolver: zodResolver(featuredSchema),
    defaultValues: {
      featuredAnnouncementId: initialData.featuredAnnouncementId || "",
      featuredEventId: initialData.featuredEventId || "",
    },
  });

  const onSubmit = (values: FeaturedFormValues) => {
    startTransition(async () => {
      const result = await saveHomepageContentAction({
        id: initialData.id,
        heroTitle: initialData.heroTitle,
        heroSubtitle: initialData.heroSubtitle,
        heroPrimaryCtaLabel: initialData.heroPrimaryCtaLabel,
        heroPrimaryCtaHref: initialData.heroPrimaryCtaHref,
        welcomeTitle: initialData.welcomeTitle,
        welcomeContent: initialData.welcomeContent,
        donationCtaTitle: initialData.donationCtaTitle,
        donationCtaDescription: initialData.donationCtaDescription,
        featuredAnnouncementId: values.featuredAnnouncementId ? values.featuredAnnouncementId : undefined,
        featuredEventId: values.featuredEventId ? values.featuredEventId : undefined,
        status: initialData.status,
      });

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success("Konten unggulan beranda berhasil disimpan!");
    });
  };

  return (
    <div className="bg-card text-card-foreground rounded-2xl border border-border/70 p-5 sm:p-7 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/60 mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <BookmarkCheck className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Sorotan Pengumuman & Agenda
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Pilih pengumuman dan kegiatan prioritas yang disematkan secara khusus di halaman depan.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <FormFieldWrapper
            label="Pengumuman Unggulan (Pinned)"
            hint="Akan disematkan dengan badge khusus di halaman utama."
          >
            <select
              {...form.register("featuredAnnouncementId")}
              className="w-full h-12 rounded-xl border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">-- Tidak ada pengumuman disematkan --</option>
              {announcementOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </FormFieldWrapper>

          <FormFieldWrapper
            label="Kegiatan / Kajian Utama (Pinned)"
            hint="Kegiatan terdekat yang disorot agar jamaah bersiap hadir."
          >
            <select
              {...form.register("featuredEventId")}
              className="w-full h-12 rounded-xl border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">-- Tidak ada kegiatan disematkan --</option>
              {eventOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
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
                Simpan Konten Unggulan
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
