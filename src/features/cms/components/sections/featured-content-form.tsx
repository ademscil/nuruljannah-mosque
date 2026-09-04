"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FileText, Save, Megaphone, Calendar } from "lucide-react";
import { z } from "zod";

import { ConfirmSubmitButton } from "@/components/shared/confirm-submit-button";
import { FormFieldWrapper } from "@/components/shared/form-field-wrapper";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "@/components/shared/status-badge";
import { saveHomepageContentAction } from "@/features/cms/services/homepage-content-actions";
import type { HomepageContentRecord } from "@/features/cms/types/homepage-content";

const featuredSchema = z.object({
  featuredAnnouncementId: z.string().optional(),
  featuredEventId: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
});

type FeaturedSchema = z.infer<typeof featuredSchema>;

type FeaturedContentFormProps = {
  initialData: HomepageContentRecord;
  announcementOptions: Array<{ id: string; label: string }>;
  eventOptions: Array<{ id: string; label: string }>;
};

export function FeaturedContentForm({
  initialData,
  announcementOptions,
  eventOptions,
}: FeaturedContentFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<FeaturedSchema>({
    resolver: zodResolver(featuredSchema),
    defaultValues: {
      featuredAnnouncementId: initialData.featuredAnnouncementId ?? undefined,
      featuredEventId: initialData.featuredEventId ?? undefined,
      status: initialData.status,
    },
  });

  const handleSubmit = (values: FeaturedSchema) => {
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
        donationCtaTitle: initialData.donationCtaTitle,
        donationCtaDescription: initialData.donationCtaDescription,
      });

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success("Konten pilihan berhasil diperbarui! 🎉");
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card-3d-advanced glass-ultra rounded-3xl p-8 shadow-depth-lg space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 shadow-depth-sm">
              <FileText className="h-6 w-6 text-violet-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold tracking-tight">Konten Pilihan</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Pilih pengumuman atau agenda yang ingin ditampilkan di beranda
              </p>
            </div>
          </div>
          <StatusBadge label="Status" value={initialData.status} />
        </div>

        <form className="space-y-6" onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="space-y-6">
            {/* Featured Announcement */}
            <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-amber-50/50 to-transparent p-6 dark:from-amber-950/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                  <Megaphone className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Pengumuman Pilihan</h3>
                  <p className="text-xs text-muted-foreground">
                    Pengumuman yang akan di-highlight di beranda
                  </p>
                </div>
              </div>

              <FormFieldWrapper
                label="Pilih Pengumuman"
                hint="Opsional - Pilih pengumuman penting yang ingin ditonjolkan"
              >
                <Select
                  value={form.watch("featuredAnnouncementId") || "none"}
                  onValueChange={(value) => {
                    form.setValue(
                      "featuredAnnouncementId",
                      value === "none" ? undefined : (value ?? undefined)
                    );
                  }}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Pilih pengumuman..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Tidak ada pilihan</SelectItem>
                    {announcementOptions.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormFieldWrapper>

              {announcementOptions.length === 0 && (
                <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
                  ⚠️ Belum ada pengumuman yang dipublikasikan. Buat pengumuman terlebih dahulu di menu Pengumuman.
                </p>
              )}
            </div>

            {/* Featured Event */}
            <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-blue-50/50 to-transparent p-6 dark:from-blue-950/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Agenda Pilihan</h3>
                  <p className="text-xs text-muted-foreground">
                    Agenda kegiatan yang akan di-highlight di beranda
                  </p>
                </div>
              </div>

              <FormFieldWrapper
                label="Pilih Agenda"
                hint="Opsional - Pilih agenda penting yang akan segera berlangsung"
              >
                <Select
                  value={form.watch("featuredEventId") || "none"}
                  onValueChange={(value) => {
                    form.setValue(
                      "featuredEventId",
                      value === "none" ? undefined : (value ?? undefined)
                    );
                  }}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Pilih agenda..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Tidak ada pilihan</SelectItem>
                    {eventOptions.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormFieldWrapper>

              {eventOptions.length === 0 && (
                <p className="mt-2 text-xs text-blue-600 dark:text-blue-400">
                  ⚠️ Belum ada agenda yang dipublikasikan. Buat agenda terlebih dahulu di menu Agenda Kegiatan.
                </p>
              )}
            </div>

            {/* Status Setting */}
            <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-green-50/50 to-transparent p-6 dark:from-green-950/20">
              <h3 className="font-semibold mb-4">Status Konten Beranda</h3>

              <FormFieldWrapper
                label="Status Publikasi"
                hint="Pilih 'Tampilkan di Website' agar semua konten beranda aktif"
              >
                <Select
                  value={form.watch("status")}
                  onValueChange={(value) =>
                    form.setValue("status", value as FeaturedSchema["status"])
                  }
                >
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-gray-500" />
                        <span>Simpan sebagai Draf</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="PUBLISHED">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-green-500" />
                        <span>Tampilkan di Website</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="ARCHIVED">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-orange-500" />
                        <span>Arsipkan</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormFieldWrapper>

              <div className="mt-4 rounded-lg bg-green-100/50 dark:bg-green-900/20 p-3">
                <p className="text-xs text-green-800 dark:text-green-200">
                  💡 <strong>Tips:</strong> Pastikan status di-set ke &ldquo;Tampilkan di Website&rdquo; agar semua perubahan yang Anda buat aktif di halaman beranda.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border/50">
            <ConfirmSubmitButton
              title="Simpan perubahan konten pilihan?"
              description="Konten yang dipilih akan ditampilkan di bagian highlight beranda."
              label="Simpan Konten Pilihan"
              pendingLabel="Menyimpan..."
              isPending={isPending}
              onConfirm={() => form.handleSubmit(handleSubmit)()}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
