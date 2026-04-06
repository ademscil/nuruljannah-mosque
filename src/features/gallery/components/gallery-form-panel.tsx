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
import {
  deleteGalleryItemAction,
  saveGalleryItemAction,
} from "@/features/gallery/services/gallery-actions";
import {
  galleryFormSchema,
  type GalleryFormSchema,
} from "@/features/gallery/schemas/gallery-form-schema";
import type { GalleryItemRecord } from "@/features/gallery/types/gallery";

type GalleryFormPanelProps = {
  items: GalleryItemRecord[];
};

function getDefaultValues(item?: GalleryItemRecord): GalleryFormSchema {
  return {
    id: item?.id,
    title: item?.title ?? "",
    category: item?.category ?? "",
    imageUrl: item?.imageUrl ?? "",
    activityDate: item?.activityDate ? item.activityDate.slice(0, 16) : "",
    status: item?.status ?? "PUBLISHED",
  };
}

export function GalleryFormPanel({ items }: GalleryFormPanelProps) {
  const [selectedId, setSelectedId] = useState("new");
  const [isPending, startTransition] = useTransition();

  const selectedItem = useMemo(
    () => items.find((item) => item.id === selectedId),
    [items, selectedId],
  );

  const form = useForm<GalleryFormSchema>({
    resolver: zodResolver(galleryFormSchema),
    defaultValues: getDefaultValues(),
  });
  const selectedStatus = useWatch({
    control: form.control,
    name: "status",
  });

  const resetSelection = (id: string | null) => {
    if (!id) {
      return;
    }

    setSelectedId(id);
    const item = items.find((galleryItem) => galleryItem.id === id);
    form.reset(getDefaultValues(item));
  };

  const handleSubmit = (values: GalleryFormSchema) => {
    startTransition(async () => {
      const result = await saveGalleryItemAction(values);
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      toast.success(result.message);
      if (selectedId === "new") resetSelection("new");
    });
  };

  const handleDelete = () => {
    if (!selectedItem) return;
    startTransition(async () => {
      const result = await deleteGalleryItemAction(selectedItem.id);
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      toast.success(result.message);
      resetSelection("new");
    });
  };

  return (
    <div className="card-elevated p-6">
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Tambah / Edit Foto Galeri</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Pilih foto yang ingin diedit, atau tambahkan dokumentasi kegiatan baru.
          </p>
        </div>
        <FormFieldWrapper label="Pilih Foto" hint="Pilih 'Tambah Baru' untuk menambah foto baru">
          <Select value={selectedId} onValueChange={resetSelection}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih galeri" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">+ Tambah Foto Baru</SelectItem>
              {items.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormFieldWrapper>
      </div>
      <form className="mt-6 space-y-5" onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="grid gap-5 md:grid-cols-2">
          <FormFieldWrapper label="Judul Foto" error={form.formState.errors.title?.message}>
            <Input placeholder="Contoh: Pengajian Ahad Pagi" {...form.register("title")} />
          </FormFieldWrapper>
          <FormFieldWrapper
            label="Kategori"
            error={form.formState.errors.category?.message}
            hint="Contoh: Kegiatan, Fasilitas, Ramadan"
          >
            <Input placeholder="Contoh: Kegiatan" {...form.register("category")} />
          </FormFieldWrapper>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <FormFieldWrapper
            label="Link Foto"
            error={form.formState.errors.imageUrl?.message}
            hint="Tempel link foto dari Google Drive atau layanan lain"
          >
            <Input placeholder="https://drive.google.com/..." {...form.register("imageUrl")} />
          </FormFieldWrapper>
          <FormFieldWrapper
            label="Tanggal Kegiatan"
            error={form.formState.errors.activityDate?.message}
          >
            <Input type="datetime-local" {...form.register("activityDate")} />
          </FormFieldWrapper>
        </div>
        <FormFieldWrapper
          label="Status Tampil"
          error={form.formState.errors.status?.message}
          hint="Pilih 'Tampilkan' agar foto muncul di galeri website"
        >
          <Select
            value={selectedStatus}
            onValueChange={(value) =>
              form.setValue(
                "status",
                (value ?? "PUBLISHED") as GalleryFormSchema["status"],
              )
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DRAFT">Simpan sebagai Draf</SelectItem>
              <SelectItem value="PUBLISHED">Tampilkan di Galeri</SelectItem>
              <SelectItem value="ARCHIVED">Arsipkan</SelectItem>
            </SelectContent>
          </Select>
        </FormFieldWrapper>
        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={isPending} className="button-brand">
            {isPending ? (
              <>
                <LoaderCircle className="size-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              "Simpan Galeri"
            )}
          </Button>
          {selectedItem ? (
            <ConfirmDialog
              title="Hapus item galeri?"
              description="Item galeri yang dihapus akan hilang dari dashboard dan halaman galeri publik."
              confirmLabel="Hapus Galeri"
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
