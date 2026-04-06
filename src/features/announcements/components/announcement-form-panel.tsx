"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, Trash2 } from "lucide-react";
import { useMemo, useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/shared/confirm-dialog";
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
    <div className="card-elevated p-6">
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Tambah / Edit Pengumuman</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Pilih pengumuman yang ingin diedit, atau buat pengumuman baru.
          </p>
        </div>

        <FormFieldWrapper label="Pilih Pengumuman" hint="Pilih 'Tambah Baru' untuk membuat pengumuman baru">
          <Select value={selectedId} onValueChange={resetToSelection}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih pengumuman" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">+ Tambah Pengumuman Baru</SelectItem>
              {announcements.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormFieldWrapper>
      </div>

      <form className="mt-6 space-y-5" onSubmit={form.handleSubmit(handleSubmit)}>
        <FormFieldWrapper label="Judul Pengumuman" error={form.formState.errors.title?.message}>
          <Input placeholder="Contoh: Pengumuman Jadwal Sholat Idul Fitri" {...form.register("title")} />
        </FormFieldWrapper>

        <FormFieldWrapper
          label="Kategori"
          error={form.formState.errors.category?.message}
          hint="Contoh: Ibadah, Kegiatan, Sosial, Umum"
        >
          <Input placeholder="Contoh: Ibadah" {...form.register("category")} />
        </FormFieldWrapper>

        <FormFieldWrapper label="Isi Pengumuman" error={form.formState.errors.content?.message}>
          <Textarea rows={7} placeholder="Tulis isi pengumuman di sini..." {...form.register("content")} />
        </FormFieldWrapper>

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
              <SelectTrigger>
                <SelectValue placeholder="Pilih status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DRAFT">Simpan sebagai Draf</SelectItem>
                <SelectItem value="PUBLISHED">Tampilkan ke Publik</SelectItem>
                <SelectItem value="ARCHIVED">Arsipkan</SelectItem>
              </SelectContent>
            </Select>
          </FormFieldWrapper>
          <FormFieldWrapper label="Tanggal Tayang" hint="Kosongkan jika langsung tayang sekarang">
            <Input type="datetime-local" {...form.register("publishedAt")} />
          </FormFieldWrapper>
        </div>

        <FormFieldWrapper
          label="Link Gambar (opsional)"
          error={form.formState.errors.thumbnailUrl?.message}
          hint="Tempel link gambar dari Google Drive atau layanan lain"
        >
          <Input placeholder="https://drive.google.com/..." {...form.register("thumbnailUrl")} />
        </FormFieldWrapper>

        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={isPending} className="button-brand">
            {isPending ? (
              <>
                <LoaderCircle className="size-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              "Simpan Pengumuman"
            )}
          </Button>
          {selectedAnnouncement ? (
            <ConfirmDialog
              title="Hapus pengumuman?"
              description="Pengumuman yang dihapus akan hilang dari dashboard dan halaman publik."
              confirmLabel="Hapus Pengumuman"
              onConfirm={handleDelete}
              trigger={
                <Button type="button" variant="outline" disabled={isPending}>
                  <Trash2 className="size-4" />
                  Hapus
                </Button>
              }
            />
          ) : null}
        </div>
      </form>
    </div>
  );
}
