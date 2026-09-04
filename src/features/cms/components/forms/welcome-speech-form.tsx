"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { MessageSquare, Save, Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FormFieldWrapper } from "@/components/shared/form-field-wrapper";
import { saveHomepageContentAction } from "@/features/cms/services/homepage-content-actions";
import type { HomepageContentRecord } from "@/features/cms/types/homepage-content";

const welcomeSchema = z.object({
  welcomeTitle: z.string().min(1, "Judul sambutan wajib diisi"),
  welcomeContent: z.string().min(1, "Isi sambutan wajib diisi"),
});

type WelcomeFormValues = z.infer<typeof welcomeSchema>;

interface WelcomeSpeechFormProps {
  initialData: HomepageContentRecord;
}

export function WelcomeSpeechForm({ initialData }: WelcomeSpeechFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<WelcomeFormValues>({
    resolver: zodResolver(welcomeSchema),
    defaultValues: {
      welcomeTitle: initialData.welcomeTitle || "Sambutan Ketua DKM",
      welcomeContent: initialData.welcomeContent || "",
    },
  });

  const onSubmit = (values: WelcomeFormValues) => {
    startTransition(async () => {
      const result = await saveHomepageContentAction({
        id: initialData.id,
        heroTitle: initialData.heroTitle,
        heroSubtitle: initialData.heroSubtitle,
        heroPrimaryCtaLabel: initialData.heroPrimaryCtaLabel,
        heroPrimaryCtaHref: initialData.heroPrimaryCtaHref,
        ...values,
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

      toast.success("Sambutan DKM berhasil diperbarui!");
    });
  };

  return (
    <div className="bg-card text-card-foreground rounded-2xl border border-border/70 p-5 sm:p-7 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/60 mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <MessageSquare className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Sambutan Pengurus / DKM
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Pesan taushiyah atau ucapan selamat datang dari Dewan Kemakmuran Masjid untuk para jamaah.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6">
          <FormFieldWrapper
            label="Judul Sambutan"
            error={form.formState.errors.welcomeTitle?.message}
            hint="Contoh: Sambutan Ketua DKM Masjid Nurul Jannah"
          >
            <Input
              {...form.register("welcomeTitle")}
              placeholder="Sambutan Ketua DKM"
              className="h-12 text-base font-semibold"
            />
          </FormFieldWrapper>

          <FormFieldWrapper
            label="Isi Sambutan Lengkap"
            error={form.formState.errors.welcomeContent?.message}
            hint="Sampaikan pesan hangat, rasa syukur, serta keterbukaan masjid untuk seluruh lapisan masyarakat."
          >
            <Textarea
              {...form.register("welcomeContent")}
              placeholder="Assalamu'alaikum Warahmatullahi Wabarakatuh..."
              rows={8}
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
                Simpan Sambutan DKM
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
