"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { MessageSquare, Eye } from "lucide-react";
import { z } from "zod";

import { ConfirmSubmitButton } from "@/components/shared/confirm-submit-button";
import { FormFieldWrapper } from "@/components/shared/form-field-wrapper";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { saveHomepageContentAction } from "@/features/cms/services/homepage-content-actions";
import type { HomepageContentRecord } from "@/features/cms/types/homepage-content";

const welcomeSchema = z.object({
  welcomeTitle: z.string().min(1, "Judul sambutan wajib diisi"),
  welcomeContent: z.string().min(1, "Isi sambutan wajib diisi"),
});

type WelcomeSchema = z.infer<typeof welcomeSchema>;

type WelcomeSectionFormProps = {
  initialData: HomepageContentRecord;
};

export function WelcomeSectionForm({ initialData }: WelcomeSectionFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<WelcomeSchema>({
    resolver: zodResolver(welcomeSchema),
    defaultValues: {
      welcomeTitle: initialData.welcomeTitle,
      welcomeContent: initialData.welcomeContent,
    },
  });

  const titleValue = useWatch({ control: form.control, name: "welcomeTitle" });
  const contentValue = useWatch({ control: form.control, name: "welcomeContent" });

  const handleSubmit = (values: WelcomeSchema) => {
    startTransition(async () => {
      const result = await saveHomepageContentAction({
        id: initialData.id,
        ...values,
        // Keep other fields unchanged
        heroTitle: initialData.heroTitle,
        heroSubtitle: initialData.heroSubtitle,
        heroPrimaryCtaLabel: initialData.heroPrimaryCtaLabel,
        heroPrimaryCtaHref: initialData.heroPrimaryCtaHref,
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

      toast.success("Sambutan berhasil diperbarui! 🎉");
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
      {/* Form Section */}
      <div className="card-3d-advanced glass-ultra rounded-3xl p-4 sm:p-6 lg:p-8 shadow-depth-lg space-y-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 shadow-depth-sm">
            <MessageSquare className="h-6 w-6 text-emerald-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold tracking-tight">Sambutan</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Pesan dari takmir atau pengurus masjid kepada jamaah
            </p>
          </div>
        </div>

        <form className="space-y-5" onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="space-y-5">
            <FormFieldWrapper
              label="Judul Sambutan"
              error={form.formState.errors.welcomeTitle?.message}
              hint="Bisa berupa jabatan atau nama (contoh: Sambutan Ketua Takmir)"
            >
              <Input
                {...form.register("welcomeTitle")}
                placeholder="Contoh: Sambutan Ketua Takmir Masjid"
                className="text-lg font-semibold h-12"
              />
            </FormFieldWrapper>

            <FormFieldWrapper
              label="Isi Sambutan"
              error={form.formState.errors.welcomeContent?.message}
              hint="Tulis pesan hangat dan inspiratif untuk jamaah (3-5 paragraf)"
            >
              <Textarea
                {...form.register("welcomeContent")}
                rows={12}
                placeholder={`Assalamu'alaikum Warahmatullahi Wabarakatuh,

Alhamdulillah, segala puji bagi Allah SWT yang telah memberikan rahmat dan karunia-Nya kepada kita semua...

[Lanjutkan sambutan Anda di sini]`}
                className="resize-none leading-relaxed"
              />
            </FormFieldWrapper>
          </div>

          <div className="pt-4 border-t border-border/50">
            <ConfirmSubmitButton
              title="Simpan perubahan sambutan?"
              description="Pesan sambutan akan ditampilkan di halaman beranda."
              label="Simpan Sambutan"
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
            <Eye className="h-5 w-5 text-emerald-600" />
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

            {/* Preview Content */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                Isi Sambutan
              </p>
              <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                {contentValue || "Belum ada isi sambutan"}
              </div>
            </div>

            {/* Word count */}
            <div className="pt-3 border-t border-border/30">
              <p className="text-xs text-muted-foreground">
                📝 Jumlah kata: <strong>{contentValue ? contentValue.split(/\s+/).filter(Boolean).length : 0}</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Tips Card */}
        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-5 space-y-3 dark:bg-emerald-950/30 dark:border-emerald-900/50">
          <h4 className="font-semibold text-sm flex items-center gap-2 text-emerald-900 dark:text-emerald-100">
            💡 Tips Sambutan yang Baik
          </h4>
          <ul className="space-y-2 text-xs text-emerald-800 dark:text-emerald-200">
            <li className="flex gap-2">
              <span>•</span>
              <span>Mulai dengan salam dan puji syukur kepada Allah SWT</span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>Sampaikan visi dan misi masjid dengan jelas</span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>Ajak jamaah untuk aktif dalam kegiatan masjid</span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>Tutup dengan harapan dan doa</span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>Panjang ideal: 200-400 kata (3-5 paragraf)</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
