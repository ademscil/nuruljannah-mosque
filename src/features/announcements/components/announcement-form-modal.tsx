"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FileText, Tag, Calendar, Image as ImageIcon, Plus, Pencil } from "lucide-react";
import { SmartImageUploader } from "@/components/shared/smart-image-uploader";
import { useAutoSaveDraft } from "@/hooks/use-autosave-draft";
import { useEffect, useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { FormFieldWrapper } from "@/components/shared/form-field-wrapper";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { saveAnnouncementAction } from "@/features/announcements/services/announcement-actions";
import {
  announcementFormSchema,
  type AnnouncementFormSchema,
} from "@/features/announcements/schemas/announcement-form-schema";
import type { AnnouncementListItem } from "@/features/announcements/types/announcement";
import { slugify } from "@/lib/slugify";

type AnnouncementFormModalProps = {
  announcement?: AnnouncementListItem;
  mode?: "create" | "edit";
};

function getDefaultValues(
  announcement?: AnnouncementListItem,
): AnnouncementFormSchema {
  return {
    id: announcement?.id,
    title: announcement?.title ?? "",
    slug: announcement?.slug ?? "",
    content: announcement?.content ?? "",
    category: announcement?.category ?? "",
    status: announcement?.status ?? "DRAFT",
    publishedAt: announcement?.publishedAt ?? "",
    thumbnailUrl: "",
  };
}

export function AnnouncementFormModal({
  announcement,
  mode = "create",
}: AnnouncementFormModalProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<AnnouncementFormSchema>({
    resolver: zodResolver(announcementFormSchema),
    defaultValues: getDefaultValues(announcement),
  });

  const formKey = mode === "create" ? "draft_announcement_new" : ("draft_announcement_" + announcement?.id);
  const thumbnailUrlValue = useWatch({ control: form.control, name: "thumbnailUrl" });
  const { clearDraft } = useAutoSaveDraft({
    key: formKey,
    watch: form.watch,
    isDirty: form.formState.isDirty,
    onRestore: (saved) => {
      form.reset({ ...getDefaultValues(announcement), ...saved });
      toast.info("Draf pengumuman berhasil dipulihkan.");
    },
  });

  const selectedStatus = useWatch({
    control: form.control,
    name: "status",
  });

  // Reset form when modal opens/closes or announcement changes
  useEffect(() => {
    if (open) {
      form.reset(getDefaultValues(announcement));
    }
  }, [open, announcement, form]);

  const handleSubmit = (values: AnnouncementFormSchema) => {
    startTransition(async () => {
      const result = await saveAnnouncementAction({
        ...values,
        slug: values.slug || slugify(values.title),
      });

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      clearDraft();
      toast.success(result.message);
      setOpen(false);
      form.reset();
    });
  };

  const triggerButton = mode === "create" ? (
    <Button size="default">
      <Plus className="h-4 w-4" />
      Tambah Pengumuman
    </Button>
  ) : (
    <Button variant="ghost" size="icon-sm">
      <Pencil className="h-4 w-4" />
      <span className="sr-only">Edit</span>
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={triggerButton} />
      <DialogContent size="xl" className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Tambah Pengumuman Baru" : "Edit Pengumuman"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Isi form di bawah untuk membuat pengumuman baru"
              : "Perbarui informasi pengumuman"}
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-5" onSubmit={form.handleSubmit(handleSubmit)}>
          {/* Basic Info Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <FileText className="h-4 w-4 text-primary" />
              <span>Informasi Dasar</span>
            </div>

            <FormFieldWrapper
              label="Judul Pengumuman"
              error={form.formState.errors.title?.message}
            >
              <Input
                placeholder="Contoh: Pengumuman Jadwal Sholat Idul Fitri"
                {...form.register("title")}
              />
            </FormFieldWrapper>

            <FormFieldWrapper
              label="Kategori"
              error={form.formState.errors.category?.message}
              hint="Contoh: Ibadah, Kegiatan, Sosial, Umum"
            >
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <Input
                  placeholder="Contoh: Ibadah"
                  {...form.register("category")}
                  className="pl-10"
                />
              </div>
            </FormFieldWrapper>

            <FormFieldWrapper
              label="Isi Pengumuman"
              error={form.formState.errors.content?.message}
            >
              <Textarea
                rows={6}
                placeholder="Tulis isi pengumuman di sini dengan jelas dan mudah dipahami..."
                {...form.register("content")}
                className="resize-none"
              />
            </FormFieldWrapper>
          </div>

          {/* Publish Settings Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Calendar className="h-4 w-4 text-primary" />
              <span>Pengaturan Tayang</span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormFieldWrapper
                label="Status Tampil"
                error={form.formState.errors.status?.message}
              >
                <Select
                  value={selectedStatus}
                  onValueChange={(value) =>
                    form.setValue(
                      "status",
                      (value ?? "DRAFT") as AnnouncementFormSchema["status"],
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="PUBLISHED">Publish</SelectItem>
                    <SelectItem value="ARCHIVED">Arsip</SelectItem>
                  </SelectContent>
                </Select>
              </FormFieldWrapper>

              <FormFieldWrapper
                label="Tanggal Tayang"
                hint="Kosongkan untuk langsung tayang"
              >
                <Input
                  type="datetime-local"
                  {...form.register("publishedAt")}
                />
              </FormFieldWrapper>
            </div>
          </div>

          {/* Media Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <ImageIcon className="h-4 w-4 text-primary" />
              <span>Poster / Banner Pengumuman (Opsional)</span>
            </div>

            <FormFieldWrapper
              label="Foto / Flyer Pengumuman"
              error={form.formState.errors.thumbnailUrl?.message}
              hint="Format gambar otomatis dikompresi menjadi WebP ringan (<150KB) untuk pemuatan cepat"
            >
              <SmartImageUploader
                value={thumbnailUrlValue ?? ""}
                onChange={(url) => form.setValue("thumbnailUrl", url, { shouldValidate: true, shouldDirty: true })}
                folder="announcements"
                aspectRatio="16:9"
              />
            </FormFieldWrapper>
          </div>

          {/* Footer Actions */}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Menyimpan..." : "Simpan Pengumuman"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
