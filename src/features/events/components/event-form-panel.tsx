"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Sparkles, Calendar, FileText, MapPin, User, Image, Trash2, Eye, Star } from "lucide-react";
import { useMemo, useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { ConfirmSubmitButton } from "@/components/shared/confirm-submit-button";
import { FormFieldWrapper } from "@/components/shared/form-field-wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { slugify } from "@/lib/slugify";
import { deleteEventAction, saveEventAction } from "@/features/events/services/event-actions";
import { eventFormSchema, type EventFormSchema } from "@/features/events/schemas/event-form-schema";
import type { EventListItem } from "@/features/events/types/event";

type EventFormPanelProps = {
  events: EventListItem[];
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

export function EventFormPanel({ events }: EventFormPanelProps) {
  const [selectedId, setSelectedId] = useState("new");
  const [isPending, startTransition] = useTransition();

  const selectedEvent = useMemo(
    () => events.find((item) => item.id === selectedId),
    [events, selectedId],
  );

  const form = useForm<EventFormSchema>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: getDefaultValues(),
  });
  const selectedStatus = useWatch({ control: form.control, name: "status" });
  const isPublic = useWatch({ control: form.control, name: "isPublic" });
  const isFeatured = useWatch({ control: form.control, name: "isFeatured" });

  const resetSelection = (id: string | null) => {
    if (!id) return;
    setSelectedId(id);
    const event = events.find((item) => item.id === id);
    form.reset(getDefaultValues(event));
  };

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

      toast.success(result.message);
      if (selectedId === "new") {
        resetSelection("new");
      }
    });
  };

  const handleDelete = () => {
    if (!selectedEvent) return;

    startTransition(async () => {
      const result = await deleteEventAction(selectedEvent.id);
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      toast.success(result.message);
      resetSelection("new");
    });
  };

  return (
    <div className="glass-ultra rounded-3xl border border-border/50 p-8 shadow-depth-lg backdrop-blur-sm">
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 pointer-events-none" />
      
      <div className="relative space-y-6">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 shadow-depth-sm">
            <Sparkles className="h-6 w-6 text-purple-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Kelola Agenda Kegiatan
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Tambah agenda baru atau edit yang sudah ada
            </p>
          </div>
        </div>

        {/* Selection */}
        <div className="rounded-2xl border border-border/50 bg-background/50 p-5 backdrop-blur-sm">
          <FormFieldWrapper label="Pilih Agenda" hint="Pilih 'Tambah Baru' untuk membuat agenda baru">
            <Select value={selectedId} onValueChange={resetSelection}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Pilih agenda" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-purple-600" />
                    <span className="font-medium">+ Tambah Agenda Baru</span>
                  </div>
                </SelectItem>
                {events.map((item) => (
                  <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormFieldWrapper>
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={form.handleSubmit(handleSubmit)}>
          {/* Basic Info */}
          <div className="rounded-2xl border border-border/50 bg-background/50 p-6 space-y-5 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <FileText className="h-4 w-4 text-purple-600" />
              <span>Informasi Dasar</span>
            </div>

            <FormFieldWrapper label="Nama Kegiatan" error={form.formState.errors.name?.message}>
              <Input placeholder="Contoh: Pengajian Rutin Ahad Pagi" {...form.register("name")} className="h-11" />
            </FormFieldWrapper>

            <FormFieldWrapper label="Keterangan Singkat" error={form.formState.errors.description?.message}>
              <Textarea rows={4} placeholder="Jelaskan kegiatan ini..." {...form.register("description")} />
            </FormFieldWrapper>
          </div>

          {/* Schedule & Location */}
          <div className="rounded-2xl border border-border/50 bg-background/50 p-6 space-y-5 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Calendar className="h-4 w-4 text-blue-600" />
              <span>Jadwal & Lokasi</span>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <FormFieldWrapper label="Tanggal & Jam Mulai" error={form.formState.errors.date?.message}>
                <Input type="datetime-local" {...form.register("date")} className="h-11" />
              </FormFieldWrapper>
              <FormFieldWrapper label="Keterangan Waktu" error={form.formState.errors.timeLabel?.message} hint="Contoh: 08.00 - 10.00 WIB">
                <Input placeholder="08.00 - 10.00 WIB" {...form.register("timeLabel")} className="h-11" />
              </FormFieldWrapper>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <FormFieldWrapper label="Lokasi" error={form.formState.errors.location?.message}>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Contoh: Aula Utama Masjid" {...form.register("location")} className="h-11 pl-10" />
                </div>
              </FormFieldWrapper>
              <FormFieldWrapper label="Penanggung Jawab" error={form.formState.errors.personInCharge?.message}>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Nama pengurus" {...form.register("personInCharge")} className="h-11 pl-10" />
                </div>
              </FormFieldWrapper>
            </div>
          </div>

          {/* Status & Media */}
          <div className="rounded-2xl border border-border/50 bg-background/50 p-6 space-y-5 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Image className="h-4 w-4 text-emerald-600" />
              <span>Status & Media</span>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <FormFieldWrapper label="Status Kegiatan" error={form.formState.errors.status?.message} hint="Pilih 'Tampilkan' agar muncul di website">
                <Select value={selectedStatus} onValueChange={(value) => form.setValue("status", (value ?? "DRAFT") as EventFormSchema["status"])}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Simpan sebagai Draf</SelectItem>
                    <SelectItem value="PUBLISHED">Tampilkan ke Publik</SelectItem>
                    <SelectItem value="COMPLETED">Sudah Selesai</SelectItem>
                    <SelectItem value="CANCELLED">Dibatalkan</SelectItem>
                  </SelectContent>
                </Select>
              </FormFieldWrapper>
              <FormFieldWrapper label="Link Poster (opsional)" error={form.formState.errors.posterUrl?.message}>
                <Input placeholder="https://drive.google.com/..." {...form.register("posterUrl")} className="h-11" />
              </FormFieldWrapper>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <FormFieldWrapper label="Tampilkan di Website" hint="Aktifkan agar jamaah bisa lihat">
                <div className="flex h-11 items-center gap-3 rounded-xl border border-border/50 bg-background px-4">
                  <Switch checked={isPublic} onCheckedChange={(checked) => form.setValue("isPublic", checked)} />
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{isPublic ? "Ya, tampilkan" : "Tidak ditampilkan"}</span>
                </div>
              </FormFieldWrapper>
              <FormFieldWrapper label="Tandai Unggulan" hint="Tampil lebih menonjol">
                <div className="flex h-11 items-center gap-3 rounded-xl border border-border/50 bg-background px-4">
                  <Switch checked={isFeatured} onCheckedChange={(checked) => form.setValue("isFeatured", checked)} />
                  <Star className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{isFeatured ? "Ya, unggulan" : "Tidak"}</span>
                </div>
              </FormFieldWrapper>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-2">
            <ConfirmSubmitButton
              title="Simpan data agenda?"
              description="Jadwal agenda akan diperbarui dan dapat tampil ke publik jika status aktif."
              label="Simpan Agenda"
              pendingLabel="Menyimpan..."
              isPending={isPending}
              onConfirm={() => form.handleSubmit(handleSubmit)()}
            />
            {selectedEvent ? (
              <ConfirmDialog
                title="Hapus agenda?"
                description="Agenda yang dihapus tidak akan lagi tampil di dashboard maupun halaman publik."
                confirmLabel="Hapus Agenda"
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
