"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { ContentPreviewCard } from "@/components/shared/content-preview-card";
import { FormFieldWrapper } from "@/components/shared/form-field-wrapper";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  saveHomepageContentAction,
} from "@/features/cms/services/homepage-content-actions";
import {
  homepageContentSchema,
  type HomepageContentSchema,
} from "@/features/cms/schemas/homepage-content-schema";
import type { HomepageContentRecord } from "@/features/cms/types/homepage-content";

type HomepageContentFormProps = {
  initialData: HomepageContentRecord;
};

export function HomepageContentForm({
  initialData,
}: HomepageContentFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<HomepageContentSchema>({
    resolver: zodResolver(homepageContentSchema),
    defaultValues: {
      heroTitle: initialData.heroTitle,
      heroSubtitle: initialData.heroSubtitle,
      heroPrimaryCtaLabel: initialData.heroPrimaryCtaLabel,
      heroPrimaryCtaHref: initialData.heroPrimaryCtaHref,
      welcomeTitle: initialData.welcomeTitle,
      welcomeContent: initialData.welcomeContent,
      donationCtaTitle: initialData.donationCtaTitle,
      donationCtaDescription: initialData.donationCtaDescription,
      status: initialData.status,
    },
  });
  const statusValue = useWatch({
    control: form.control,
    name: "status",
  });
  const heroTitleValue = useWatch({
    control: form.control,
    name: "heroTitle",
  });
  const heroSubtitleValue = useWatch({
    control: form.control,
    name: "heroSubtitle",
  });
  const welcomeTitleValue = useWatch({
    control: form.control,
    name: "welcomeTitle",
  });
  const welcomeContentValue = useWatch({
    control: form.control,
    name: "welcomeContent",
  });
  const donationTitleValue = useWatch({
    control: form.control,
    name: "donationCtaTitle",
  });
  const donationDescriptionValue = useWatch({
    control: form.control,
    name: "donationCtaDescription",
  });

  const handleSubmit = (values: HomepageContentSchema) => {
    startTransition(async () => {
      const result = await saveHomepageContentAction({
        id: initialData.id,
        ...values,
      });

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
    });
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <form
        className="space-y-6 rounded-[2rem] border border-border/70 bg-card p-6 shadow-sm"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              Form pengaturan beranda
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Ubah section utama beranda yang tampil untuk jamaah.
            </p>
          </div>
          <StatusBadge
            label={initialData.source === "database" ? "Terhubung DB" : "Mode Demo"}
            value={initialData.status}
          />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <FormFieldWrapper
            label="Hero Title"
            error={form.formState.errors.heroTitle?.message}
            className="md:col-span-2"
          >
            <Input {...form.register("heroTitle")} />
          </FormFieldWrapper>

          <FormFieldWrapper
            label="Hero Subtitle"
            error={form.formState.errors.heroSubtitle?.message}
            className="md:col-span-2"
          >
            <Textarea rows={4} {...form.register("heroSubtitle")} />
          </FormFieldWrapper>

          <FormFieldWrapper
            label="Label CTA Utama"
            error={form.formState.errors.heroPrimaryCtaLabel?.message}
          >
            <Input {...form.register("heroPrimaryCtaLabel")} />
          </FormFieldWrapper>

          <FormFieldWrapper
            label="Link CTA Utama"
            error={form.formState.errors.heroPrimaryCtaHref?.message}
          >
            <Input {...form.register("heroPrimaryCtaHref")} />
          </FormFieldWrapper>

          <FormFieldWrapper
            label="Judul Sambutan"
            error={form.formState.errors.welcomeTitle?.message}
          >
            <Input {...form.register("welcomeTitle")} />
          </FormFieldWrapper>

          <FormFieldWrapper
            label="Status Konten"
            error={form.formState.errors.status?.message}
          >
            <Select
              value={statusValue}
              onValueChange={(value) =>
                form.setValue("status", value as HomepageContentSchema["status"])
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="PUBLISHED">Publish</SelectItem>
                <SelectItem value="ARCHIVED">Archived</SelectItem>
              </SelectContent>
            </Select>
          </FormFieldWrapper>

          <FormFieldWrapper
            label="Isi Sambutan"
            error={form.formState.errors.welcomeContent?.message}
            className="md:col-span-2"
          >
            <Textarea rows={5} {...form.register("welcomeContent")} />
          </FormFieldWrapper>

          <FormFieldWrapper
            label="Judul CTA Donasi"
            error={form.formState.errors.donationCtaTitle?.message}
            className="md:col-span-2"
          >
            <Input {...form.register("donationCtaTitle")} />
          </FormFieldWrapper>

          <FormFieldWrapper
            label="Deskripsi CTA Donasi"
            error={form.formState.errors.donationCtaDescription?.message}
            className="md:col-span-2"
          >
            <Textarea rows={4} {...form.register("donationCtaDescription")} />
          </FormFieldWrapper>
        </div>

        <Button
          type="submit"
          disabled={isPending}
          className="rounded-full bg-emerald-700 px-5 hover:bg-emerald-800"
        >
          {isPending ? (
            <>
              <LoaderCircle className="size-4 animate-spin" />
              Menyimpan...
            </>
          ) : (
            "Simpan CMS Beranda"
          )}
        </Button>
      </form>

      <div className="space-y-4">
        <ContentPreviewCard
          eyebrow="Preview Hero"
          title={heroTitleValue}
          description={heroSubtitleValue}
        />
        <ContentPreviewCard
          eyebrow="Preview Sambutan"
          title={welcomeTitleValue}
          description={welcomeContentValue}
        />
        <ContentPreviewCard
          eyebrow="Preview Donasi"
          title={donationTitleValue}
          description={donationDescriptionValue}
        />
      </div>
    </div>
  );
}
