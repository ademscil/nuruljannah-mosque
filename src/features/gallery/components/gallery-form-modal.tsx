"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Image as ImageIcon, Tag, Link2, ToggleLeft } from "lucide-react";
import { useTransition, useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { FormFieldWrapper } from "@/components/shared/form-field-wrapper";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { saveGalleryItemAction } from "@/features/gallery/services/gallery-actions";
import {
  galleryFormSchema,
  type GalleryFormSchema,
} from "@/features/gallery/schemas/gallery-form-schema";
import type { GalleryItemRecord } from "@/features/gallery/types/gallery";

type GalleryFormModalProps = {
  item?: GalleryItemRecord;
  trigger: React.ReactElement;
  onSuccess?: () => void;
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

export function GalleryFormModal({ item, trigger, onSuccess }: GalleryFormModalProps) {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const form = useForm<GalleryFormSchema>({
    resolver: zodResolver(galleryFormSchema),
    defaultValues: getDefaultValues(item),
  });

  const selectedStatus = useWatch({
    control: form.control,
    name: "status",
  });

  useEffect(() => {
    if (open) {
      form.reset(getDefaultValues(item));
    }
  }, [open, item, form]);

  const handleSubmit = (values: GalleryFormSchema) => {
    startTransition(async () => {
      const result = await saveGalleryItemAction(values);
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      toast.success(result.message);
      setOpen(false);
      onSuccess?.();
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />
      <DialogContent size="xl" className="max-h-[90vh] overflow-y-auto">
        <DialogTitle>{item ? "Edit Foto Galeri" : "Tambah Foto Baru"}</DialogTitle>
        <DialogDescription>
          {item
            ? "Perbarui informasi foto galeri yang ada."
            : "Tambahkan dokumentasi kegiatan baru ke galeri."}
        </DialogDescription>

        <form className="space-y-5" onSubmit={form.handleSubmit(handleSubmit)}>
          {/* Basic Info Section */}
          <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-muted/30 to-muted/10 p-5 backdrop-blur-sm">
            <div className="mb-4 flex items-center gap-2">
              <ImageIcon className="size-4 text-muted-foreground" />
              <span className="text-sm font-semibold text-foreground">Informasi Foto</span>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
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
          </div>

          {/* Image & Date Section */}
          <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-muted/30 to-muted/10 p-5 backdrop-blur-sm">
            <div className="mb-4 flex items-center gap-2">
              <Link2 className="size-4 text-muted-foreground" />
              <span className="text-sm font-semibold text-foreground">Link & Tanggal</span>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
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
          </div>

          {/* Status Section */}
          <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-muted/30 to-muted/10 p-5 backdrop-blur-sm">
            <div className="mb-4 flex items-center gap-2">
              <ToggleLeft className="size-4 text-muted-foreground" />
              <span className="text-sm font-semibold text-foreground">Status Tampil</span>
            </div>
            <FormFieldWrapper
              label="Status publikasi"
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
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
              Batal
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Menyimpan..." : item ? "Simpan Perubahan" : "Tambah Foto"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
