"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  FileText,
  Calendar,
  MapPin,
  User,
  Image as ImageIcon,
  Plus,
  Pencil,
  Eye,
  Star,
} from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { FormFieldWrapper } from "@/components/shared/form-field-wrapper";
import { SmartImageUploader } from "@/components/shared/smart-image-uploader";
import { useAutoSaveDraft } from "@/hooks/use-autosave-draft";
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { saveEventAction } from "@/features/events/services/event-actions";
import {
  eventFormSchema,
  type EventFormSchema,
} from "@/features/events/schemas/event-form-schema";
import type { EventListItem } from "@/features/events/types/event";
import { slugify } from "@/lib/slugify";

type EventFormModalProps = {
  event?: EventListItem;
  mode?: "create" | "edit";
};

function getDefaultValues(event?: EventListItem): EventFormSchema {
  return {
    id: event?.id,
    name: event?.name ?? "",
    slug: event?.slug ?? "",
    description: event?.description ?? "",
    date: event?.date ? event.date.slice(0, 16) : "",
    timeLabel: event?.timeLabel ?? "",
    location: event?.location ?? "",
    personInCharge: event?.personInCharge ?? "",
    status: event?.status ?? "DRAFT",
    isPublic: event?.isPublic ?? false,
    isFeatured: event?.isFeatured ?? false,
    posterUrl: event?.posterUrl ?? "",
  };
}

export function EventFormModal({ event, mode = "create" }: EventFormModalProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<EventFormSchema>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: getDefaultValues(event),
  });

  const formKey = mode === "create" ? "draft_event_new" : ("draft_event_" + event?.id);
  const posterUrlValue = useWatch({ control: form.control, name: "posterUrl" });
  const { clearDraft } = useAutoSaveDraft({
    key: formKey,
    watch: form.watch,
    isDirty: form.formState.isDirty,
    onRestore: (saved) => {
      form.reset({ ...getDefaultValues(event), ...saved });
      toast.info("Draf kegiatan berhasil dipulihkan.");
    },
  });

  const selectedStatus = useWatch({
    control: form.control,
    name: "status",
  });

  const isPublic = useWatch({
    control: form.control,
    name: "isPublic",
  });

  const isFeatured = useWatch({
    control: form.control,
    name: "isFeatured",
  });

  // Reset form when modal opens/closes or event changes
  useEffect(() => {
    if (open) {
      form.reset(getDefaultValues(event));
    }
  }, [open, event, form]);

  const handleSubmit = (values: EventFormSchema) => {
    startTransition(async () => {
      const result = await saveEventAction({
        ...values,
        slug: values.slug || slugify(values.name),
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

  const triggerButton =
    mode === "create" ? (
      <Button size="default">
        <Plus className="h-4 w-4" />
        Tambah Agenda
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
            {mode === "create" ? "Tambah Agenda Baru" : "Edit Agenda"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Isi form di bawah untuk membuat agenda kegiatan baru"
              : "Perbarui informasi agenda kegiatan"}
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
              label="Nama Kegiatan"
              error={form.formState.errors.name?.message}
            >
              <Input
                placeholder="Contoh: Pengajian Rutin Ahad Pagi"
                {...form.register("name")}
              />
            </FormFieldWrapper>

            <FormFieldWrapper
              label="Keterangan Singkat"
              error={form.formState.errors.description?.message}
            >
              <Textarea
                rows={4}
                placeholder="Jelaskan kegiatan ini dengan jelas dan mudah dipahami..."
                {...form.register("description")}
                className="resize-none"
              />
            </FormFieldWrapper>
          </div>

          {/* Schedule & Location Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Calendar className="h-4 w-4 text-primary" />
              <span>Jadwal & Lokasi</span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormFieldWrapper
                label="Tanggal & Jam Mulai"
                error={form.formState.errors.date?.message}
              >
                <Input type="datetime-local" {...form.register("date")} />
              </FormFieldWrapper>

              <FormFieldWrapper
                label="Keterangan Waktu"
                error={form.formState.errors.timeLabel?.message}
                hint="Contoh: 08.00 - 10.00 WIB"
              >
                <Input
                  placeholder="08.00 - 10.00 WIB"
                  {...form.register("timeLabel")}
                />
              </FormFieldWrapper>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormFieldWrapper
                label="Lokasi"
                error={form.formState.errors.location?.message}
              >
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  <Input
                    placeholder="Contoh: Aula Utama Masjid"
                    {...form.register("location")}
                    className="pl-10"
                  />
                </div>
              </FormFieldWrapper>

              <FormFieldWrapper
                label="Penanggung Jawab"
                error={form.formState.errors.personInCharge?.message}
              >
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  <Input
                    placeholder="Nama pengurus"
                    {...form.register("personInCharge")}
                    className="pl-10"
                  />
                </div>
              </FormFieldWrapper>
            </div>
          </div>

          {/* Status & Visibility Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <ImageIcon className="h-4 w-4 text-primary" />
              <span>Status & Tampilan</span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormFieldWrapper
                label="Status Kegiatan"
                error={form.formState.errors.status?.message}
              >
                <Select
                  value={selectedStatus}
                  onValueChange={(value) =>
                    form.setValue(
                      "status",
                      (value ?? "DRAFT") as EventFormSchema["status"],
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Simpan sebagai Draf</SelectItem>
                    <SelectItem value="PUBLISHED">
                      Tampilkan ke Publik
                    </SelectItem>
                    <SelectItem value="COMPLETED">Sudah Selesai</SelectItem>
                    <SelectItem value="CANCELLED">Dibatalkan</SelectItem>
                  </SelectContent>
                </Select>
              </FormFieldWrapper>

              <FormFieldWrapper
                label="Flyer / Poster Kajian (Opsional)"
                error={form.formState.errors.posterUrl?.message}
                hint="Format gambar otomatis dikompresi menjadi WebP ringan (<150KB) dengan rasio 4:5 standar poster Instagram / WhatsApp"
              >
                <SmartImageUploader
                  value={posterUrlValue ?? ""}
                  onChange={(url) => form.setValue("posterUrl", url, { shouldValidate: true, shouldDirty: true })}
                  folder="events"
                  aspectRatio="4:5"
                />
              </FormFieldWrapper>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormFieldWrapper
                label="Tampilkan di Website"
                hint="Aktifkan agar jamaah bisa melihat"
              >
                <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-background px-4 py-3">
                  <Switch
                    checked={isPublic}
                    onCheckedChange={(checked) =>
                      form.setValue("isPublic", checked)
                    }
                  />
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {isPublic ? "Ya, tampilkan" : "Tidak ditampilkan"}
                  </span>
                </div>
              </FormFieldWrapper>

              <FormFieldWrapper
                label="Tandai Unggulan"
                hint="Tampil lebih menonjol di halaman utama"
              >
                <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-background px-4 py-3">
                  <Switch
                    checked={isFeatured}
                    onCheckedChange={(checked) =>
                      form.setValue("isFeatured", checked)
                    }
                  />
                  <Star className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {isFeatured ? "Ya, unggulan" : "Tidak"}
                  </span>
                </div>
              </FormFieldWrapper>
            </div>
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
              {isPending ? "Menyimpan..." : "Simpan Agenda"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
