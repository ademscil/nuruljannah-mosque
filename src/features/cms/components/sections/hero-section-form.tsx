"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { Home, Eye } from "lucide-react";
import { z } from "zod";

import { ConfirmSubmitButton } from "@/components/shared/confirm-submit-button";
import { FormFieldWrapper } from "@/components/shared/form-field-wrapper";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { saveHomepageContentAction } from "@/features/cms/services/homepage-content-actions";
import type { HomepageContentRecord } from "@/features/cms/types/homepage-content";

const heroSchema = z.object({
  heroTitle: z.string().min(1, "Judul wajib diisi"),
  heroSubtitle: z.string().min(1, "Kalimat pembuka wajib diisi"),
  heroPrimaryCtaLabel: z.string().min(1, "Teks tombol wajib diisi"),
  heroPrimaryCtaHref: z.string().min(1, "Link tombol wajib diisi"),
});

type HeroSchema = z.infer<typeof heroSchema>;

type HeroSectionFormProps = {
  initialData: HomepageContentRecord;
};

export function HeroSectionForm({ initialData }: HeroSectionFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<HeroSchema>({
    resolver: zodResolver(heroSchema),
    defaultValues: {
      heroTitle: initialData.heroTitle,
      heroSubtitle: initialData.heroSubtitle,
      heroPrimaryCtaLabel: initialData.heroPrimaryCtaLabel,
      heroPrimaryCtaHref: initialData.heroPrimaryCtaHref,
    },
  });

  const titleValue = useWatch({ control: form.control, name: "heroTitle" });
  const subtitleValue = useWatch({ control: form.control, name: "heroSubtitle" });
  const ctaLabelValue = useWatch({ control: form.control, name: "heroPrimaryCtaLabel" });

  const handleSubmit = (values: HeroSchema) => {
    startTransition(async () => {
      const result = await saveHomepageContentAction({
        id: initialData.id,
        ...values,
        // Keep other fields unchanged
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

      toast.success("Banner utama berhasil diperbarui! 🎉");
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
      {/* Form Section */}
      <div className="card-3d-advanced glass-ultra rounded-3xl p-4 sm:p-6 lg:p-8 shadow-depth-lg space-y-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 shadow-depth-sm">
            <Home className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold tracking-tight">Banner Utama</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Bagian pertama yang dilihat pengunjung saat membuka website
            </p>
          </div>
        </div>

        <form className="space-y-5" onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="space-y-5">
            <FormFieldWrapper
              label="Judul Utama"
              error={form.formState.errors.heroTitle?.message}
              hint="Judul besar yang menarik perhatian (contoh: Selamat Datang di Masjid Nurul Jannah)"
            >
              <Input
                {...form.register("heroTitle")}
                placeholder="Contoh: Selamat Datang di Masjid Nurul Jannah"
                className="text-lg font-semibold h-12"
              />
            </FormFieldWrapper>

            <FormFieldWrapper
              label="Kalimat Pembuka"
              error={form.formState.errors.heroSubtitle?.message}
              hint="Pesan singkat yang menyambut jamaah (2-3 kalimat)"
            >
              <Textarea
                {...form.register("heroSubtitle")}
                rows={4}
                placeholder="Contoh: Mari bersama membangun ukhuwah islamiyah dan memakmurkan rumah Allah..."
                className="resize-none"
              />
            </FormFieldWrapper>

            <div className="grid gap-5 md:grid-cols-2">
              <FormFieldWrapper
                label="Teks Tombol"
                error={form.formState.errors.heroPrimaryCtaLabel?.message}
                hint="Kata-kata pada tombol aksi"
              >
                <Input
                  {...form.register("heroPrimaryCtaLabel")}
                  placeholder="Contoh: Lihat Agenda"
                  className="h-11"
                />
              </FormFieldWrapper>

              <FormFieldWrapper
                label="Link Tombol"
                error={form.formState.errors.heroPrimaryCtaHref?.message}
                hint="Halaman tujuan saat tombol diklik"
              >
                <Input
                  {...form.register("heroPrimaryCtaHref")}
                  placeholder="/agenda-kegiatan"
                  className="h-11 font-mono text-sm"
                />
              </FormFieldWrapper>
            </div>
          </div>

          <div className="pt-4 border-t border-border/50">
            <ConfirmSubmitButton
              title="Simpan perubahan banner utama?"
              description="Perubahan akan langsung terlihat di halaman beranda website."
              label="Simpan Banner Utama"
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
            <Eye className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Preview Live</h3>
          </div>
          
          <div className="space-y-4">
            {/* Preview Title */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                Judul
              </p>
              <p className="text-2xl font-bold text-foreground">
                {titleValue || "Belum ada judul"}
              </p>
            </div>

            {/* Preview Subtitle */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                Kalimat Pembuka
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {subtitleValue || "Belum ada kalimat pembuka"}
              </p>
            </div>

            {/* Preview Button */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                Tombol Aksi
              </p>
              <button 
                type="button"
                className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-depth-sm hover:shadow-depth-md transition-all"
                disabled
              >
                {ctaLabelValue || "Teks Tombol"}
              </button>
            </div>
          </div>
        </div>

        {/* Tips Card */}
        <div className="rounded-2xl bg-primary/5 border border-primary/20 p-5 space-y-3">
          <h4 className="font-semibold text-sm flex items-center gap-2">
            💡 Tips Banner yang Efektif
          </h4>
          <ul className="space-y-2 text-xs text-muted-foreground">
            <li className="flex gap-2">
              <span>•</span>
              <span>Gunakan judul yang singkat dan mudah diingat</span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>Kalimat pembuka sebaiknya maksimal 2-3 kalimat</span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>Teks tombol harus jelas dan mengajak (call-to-action)</span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>Link tombol bisa mengarah ke halaman agenda, donasi, atau profil</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
