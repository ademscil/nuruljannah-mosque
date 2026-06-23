"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Sparkles, FileText, Tag, Calendar, Image, Trash2 } from "lucide-react";
import { useMemo, useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { ConfirmSubmitButton } from "@/components/shared/confirm-submit-button";
import { FormFieldWrapper } from "@/components/shared/form-field-wrapper";
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
  deleteAnnouncementAction,
  saveAnnouncementAction,
} from "@/features/announcements/services/announcement-actions";
import {
  announcementFormSchema,
  type AnnouncementFormSchema,
} from "@/features/announcements/schemas/announcement-form-schema";
import type { AnnouncementListItem } from "@/features/announcements/types/announcement";
import { slugify } from "@/lib/slugify";

type AnnouncementFormPanelProps = {
  announcements: AnnouncementListItem[];
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

export function AnnouncementFormPanel({
  announcements,
}: AnnouncementFormPanelProps) {
  const [selectedId, setSelectedId] = useState<string>("new");
  const [isPending, startTransition] = useTransition();

  const selectedAnnouncement = useMemo(
    () => announcements.find((item) => item.id === selectedId),
    [announcements, selectedId],
  );

  const form = useForm<AnnouncementFormSchema>({
    resolver: zodResolver(announcementFormSchema),
    defaultValues: getDefaultValues(),
  });
  const selectedStatus = useWatch({
    control: form.control,
    name: "status",
  });

  const resetToSelection = (id: string | null) => {
    if (!id) {
      return;
    }

    setSelectedId(id);
    const selected = announcements.find((item) => item.id === id);
    form.reset(getDefaultValues(selected));
  };

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

      toast.success(result.message);
      if (selectedId === "new") {
        resetToSelection("new");
      }
    });
  };

  const handleDelete = () => {
    if (!selectedAnnouncement) {
      return;
    }

    startTransition(async () => {
      const result = await deleteAnnouncementAction(selectedAnnouncement.id);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      resetToSelection("new");
    });
  };

  return (
    <div className="glass-ultra rounded-3xl border border-border/50 p-8 shadow-depth-lg backdrop-blur-sm">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 pointer-events-none" />
      
      <div className="relative space-y-6">
        {/* Header Section */}
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 shadow-depth-sm">
            <Sparkles className="h-6 w-6 text-purple-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Kelola Pengumuman
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Tambah pengumuman baru atau edit yang sudah ada
            </p>
          </div>
        </div>

        {/* Selection Section */}
        <div className="rounded-2xl border border-border/50 bg-background/50 p-5 backdrop-blur-sm">
          <FormFieldWrapper 
            label="Pilih Pengumuman" 
            hint="Pilih 'Tambah Baru' untuk membuat pengumuman baru"
          >
            <Select value={selectedId} onValueChange={resetToSelection}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Pilih pengumuman" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-purple-600" />
                    <span className="font-medium">+ Tambah Pengumuman Baru</span>
                  </div>
                </SelectItem>
                {announcements.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormFieldWrapper>
        </div>

        {/* Form Section */}
        <form className="space-y-6" onSubmit={form.handleSubmit(handleSubmit)}>
          {/* Basic Info Card */}
          <div className="rounded-2xl border border-border/50 bg-background/50 p-6 space-y-5 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <FileText className="h-4 w-4 text-purple-600" />
              <span>Informasi Dasar</span>
            </div>

            <FormFieldWrapper label="Judul Pengumuman" error={form.formState.errors.title?.message}>
              <Input 
                placeholder="Contoh: Pengumuman Jadwal Sholat Idul Fitri" 
                {...form.register("title")} 
                className="h-11"
              />
            </FormFieldWrapper>

            <FormFieldWrapper
              label="Kategori"
              error={form.formState.errors.category?.message}
              hint="Contoh: Ibadah, Kegiatan, Sosial, Umum"
            >
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  placeholder="Contoh: Ibadah" 
                  {...form.register("category")} 
                  className="h-11 pl-10"
                />
              </div>
            </FormFieldWrapper>

            <FormFieldWrapper label="Isi Pengumuman" error={form.formState.errors.content?.message}>
              <Textarea 
                rows={8} 
                placeholder="Tulis isi pengumuman di sini dengan jelas dan mudah dipahami..." 
                {...form.register("content")}
                className="resize-none"
              />
            </FormFieldWrapper>
          </div>

          {/* Publish Settings Card */}
          <div className="rounded-2xl border border-border/50 bg-background/50 p-6 space-y-5 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Calendar className="h-4 w-4 text-blue-600" />
              <span>Pengaturan Tayang</span>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <FormFieldWrapper
                label="Status Tampil"
                error={form.formState.errors.status?.message}
                hint="Pilih 'Tampilkan' agar pengumuman muncul di website"
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
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Simpan sebagai Draf</SelectItem>
                    <SelectItem value="PUBLISHED">Tampilkan ke Publik</SelectItem>
                    <SelectItem value="ARCHIVED">Arsipkan</SelectItem>
                  </SelectContent>
                </Select>
              </FormFieldWrapper>
              
              <FormFieldWrapper 
                label="Tanggal Tayang" 
                hint="Kosongkan jika langsung tayang sekarang"
              >
                <Input 
                  type="datetime-local" 
                  {...form.register("publishedAt")} 
                  className="h-11"
                />
              </FormFieldWrapper>
            </div>
          </div>

          {/* Media Card */}
          <div className="rounded-2xl border border-border/50 bg-background/50 p-6 space-y-5 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Image className="h-4 w-4 text-emerald-600" />
              <span>Media (Opsional)</span>
            </div>

            <FormFieldWrapper
              label="Link Gambar"
              error={form.formState.errors.thumbnailUrl?.message}
              hint="Tempel link gambar dari Google Drive atau layanan lain"
            >
              <Input 
                placeholder="https://drive.google.com/..." 
                {...form.register("thumbnailUrl")} 
                className="h-11"
              />
            </FormFieldWrapper>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-2">
            <ConfirmSubmitButton
              title="Simpan pengumuman ini?"
              description="Data pengumuman akan diperbarui dan bisa langsung tampil di website."
              label="Simpan Pengumuman"
              pendingLabel="Menyimpan..."
              isPending={isPending}
              onConfirm={() => form.handleSubmit(handleSubmit)()}
            />
            {selectedAnnouncement ? (
              <ConfirmDialog
                title="Hapus pengumuman?"
                description="Pengumuman yang dihapus akan hilang dari dashboard dan halaman publik."
                confirmLabel="Hapus Pengumuman"
                onConfirm={handleDelete}
                trigger={
                  <Button type="button" variant="outline" size="default" disabled={isPending}>
                    <Trash2 className="h-4 w-4" />
                    Hapus
                  </Button>
                }
              />
            ) : null}
          </div>
        </form>
      </div>
    </div>
  );
}
