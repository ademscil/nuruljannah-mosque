"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { Heart, Eye } from "lucide-react";
import { z } from "zod";

import { ConfirmSubmitButton } from "@/components/shared/confirm-submit-button";
import { FormFieldWrapper } from "@/components/shared/form-field-wrapper";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { saveHomepageContentAction } from "@/features/cms/services/homepage-content-actions";
import type { HomepageContentRecord } from "@/features/cms/types/homepage-content";

const donationSchema = z.object({
  donationCtaTitle: z.string().min(1, "Judul ajakan donasi wajib diisi"),
  donationCtaDescription: z.string().min(1, "Keterangan ajakan donasi wajib diisi"),
});

type DonationSchema = z.infer<typeof donationSchema>;

type DonationSectionFormProps = {
  initialData: HomepageContentRecord;
};

export function DonationSectionForm({ initialData }: DonationSectionFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<DonationSchema>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      donationCtaTitle: initialData.donationCtaTitle,
      donationCtaDescription: initialData.donationCtaDescription,
    },
  });

  const titleValue = useWatch({ control: form.control, name: "donationCtaTitle" });
  const descriptionValue = useWatch({ control: form.control, name: "donationCtaDescription" });

  const handleSubmit = (values: DonationSchema) => {
    startTransition(async () => {
      const result = await saveHomepageContentAction({
        id: initialData.id,
        ...values,
        // Keep other fields unchanged
        heroTitle: initialData.heroTitle,
        heroSubtitle: initialData.heroSubtitle,
        heroPrimaryCtaLabel: initialData.heroPrimaryCtaLabel,
        heroPrimaryCtaHref: initialData.heroPrimaryCtaHref,
        welcomeTitle: initialData.welcomeTitle,
        welcomeContent: initialData.welcomeContent,
        featuredAnnouncementId: initialData.featuredAnnouncementId ?? undefined,
        featuredEventId: initialData.featuredEventId ?? undefined,
        status: initialData.status,
      });

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success("Ajakan donasi berhasil diperbarui! 🎉");
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
      {/* Form Section */}
      <div className="card-3d-advanced glass-ultra rounded-3xl p-4 sm:p-6 lg:p-8 shadow-depth-lg space-y-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/10 shadow-depth-sm">
            <Heart className="h-6 w-6 text-rose-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold tracking-tight">Ajakan Donasi</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Ajak jamaah untuk berpartisipasi dalam pembangunan masjid
            </p>
          </div>
        </div>

        <form className="space-y-5" onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="space-y-5">
            <FormFieldWrapper
              label="Judul Ajakan"
              error={form.formState.errors.donationCtaTitle?.message}
              hint="Judul yang menggerakkan hati untuk berdonasi"
            >
              <Input
                {...form.register("donationCtaTitle")}
                placeholder="Contoh: Mari Bersama Membangun Masjid"
                className="text-lg font-semibold h-12"
              />
            </FormFieldWrapper>

            <FormFieldWrapper
              label="Penjelasan Donasi"
              error={form.formState.errors.donationCtaDescription?.message}
              hint="Jelaskan alasan dan tujuan donasi dengan jelas dan menyentuh"
            >
              <Textarea
                {...form.register("donationCtaDescription")}
                rows={8}
                placeholder={`Contoh:
                
Dengan berinfaq untuk pembangunan masjid, Anda turut serta dalam memakmurkan rumah Allah. Setiap rupiah yang Anda sumbangkan adalah investasi akhirat yang akan terus mengalir pahalanya.

Mari bergandeng tangan membangun tempat beribadah yang nyaman untuk seluruh jamaah.`}
                className="resize-none leading-relaxed"
              />
            </FormFieldWrapper>
          </div>

          <div className="pt-4 border-t border-border/50">
            <ConfirmSubmitButton
              title="Simpan perubahan ajakan donasi?"
              description="Ajakan ini akan ditampilkan di halaman beranda untuk menggerakkan jamaah."
              label="Simpan Ajakan Donasi"
              pendingLabel="Menyimpan..."
              isPending={isPending}
              onConfirm={() => form.handleSubmit(handleSubmit)()}
            />
          </div>
        </form>
      </div>

      {/* Preview Section */}
      <div className="space-y-4">
        <div className="glass-frosted rounded-2xl p-6 shadow-depth-md">
          <div className="flex items-center gap-2 mb-4">
            <Eye className="h-5 w-5 text-rose-600" />
            <h3 className="font-semibold">Preview Live</h3>
          </div>
          
          <div className="space-y-4">
            {/* Preview Title */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                Judul
              </p>
              <p className="text-xl font-bold text-foreground">
                {titleValue || "Belum ada judul"}
              </p>
            </div>

            {/* Preview Description */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                Penjelasan
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {descriptionValue || "Belum ada penjelasan"}
              </p>
            </div>

            {/* Preview Button */}
            <div className="pt-3">
              <button 
                type="button"
                className="inline-flex items-center justify-center rounded-lg bg-rose-600 px-6 py-3 text-sm font-semibold text-white shadow-depth-sm hover:shadow-depth-md transition-all gap-2"
                disabled
              >
                <Heart className="h-4 w-4" />
                Donasi Sekarang
              </button>
            </div>
          </div>
        </div>

        {/* Tips Card */}
        <div className="rounded-2xl bg-rose-50 border border-rose-200 p-5 space-y-3 dark:bg-rose-950/30 dark:border-rose-900/50">
          <h4 className="font-semibold text-sm flex items-center gap-2 text-rose-900 dark:text-rose-100">
            💡 Tips Ajakan Donasi yang Efektif
          </h4>
          <ul className="space-y-2 text-xs text-rose-800 dark:text-rose-200">
            <li className="flex gap-2">
              <span>•</span>
              <span>Gunakan kata-kata yang menyentuh hati dan islami</span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>Jelaskan tujuan donasi dengan spesifik dan transparan</span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>Ingatkan tentang pahala dan keberkahan infaq</span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>Sampaikan dengan bahasa yang mudah dipahami</span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>Hindari memaksa, fokus pada ajakan yang lembut</span>
            </li>
          </ul>
        </div>

        {/* Info Box */}
        <div className="rounded-2xl bg-blue-50 border border-blue-200 p-5 dark:bg-blue-950/30 dark:border-blue-900/50">
          <h4 className="font-semibold text-sm mb-2 text-blue-900 dark:text-blue-100">
            ℹ️ Informasi
          </h4>
          <p className="text-xs text-blue-800 dark:text-blue-200">
            Tombol donasi akan mengarah ke halaman <strong>/donasi</strong> di mana jamaah dapat melihat detail rekening dan cara berdonasi.
          </p>
        </div>
      </div>
    </div>
  );
}
