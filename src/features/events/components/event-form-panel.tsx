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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { slugify } from "@/lib/slugify";
import {
  deleteEventAction,
  saveEventAction,
} from "@/features/events/services/event-actions";
import {
  eventFormSchema,
  type EventFormSchema,
} from "@/features/events/schemas/event-form-schema";
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

  const resetSelection = (id: string | null) => {
    if (!id) {
      return;
    }

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
    <div className="card-elevated p-6">
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Tambah / Edit Agenda</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Pilih agenda yang ingin diedit, atau buat agenda kegiatan baru.
          </p>
        </div>
        <FormFieldWrapper label="Pilih Agenda" hint="Pilih 'Tambah Baru' untuk membuat agenda baru">
          <Select value={selectedId} onValueChange={resetSelection}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih agenda" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">+ Tambah Agenda Baru</SelectItem>
              {events.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormFieldWrapper>
      </div>

      <form className="mt-6 space-y-5" onSubmit={form.handleSubmit(handleSubmit)}>
        <FormFieldWrapper label="Nama Kegiatan" error={form.formState.errors.name?.message}>
          <Input placeholder="Contoh: Pengajian Rutin Ahad Pagi" {...form.register("name")} />
        </FormFieldWrapper>

        <FormFieldWrapper label="Keterangan Singkat" error={form.formState.errors.description?.message}>
          <Textarea rows={4} placeholder="Jelaskan kegiatan ini secara singkat..." {...form.register("description")} />
        </FormFieldWrapper>

        <div className="grid gap-5 md:grid-cols-2">
          <FormFieldWrapper label="Tanggal & Jam Mulai" error={form.formState.errors.date?.message}>
            <Input type="datetime-local" {...form.register("date")} />
          </FormFieldWrapper>
          <FormFieldWrapper
            label="Keterangan Waktu"
            error={form.formState.errors.timeLabel?.message}
            hint="Contoh: 08.00 - 10.00 WIB"
          >
            <Input placeholder="08.00 - 10.00 WIB" {...form.register("timeLabel")} />
          </FormFieldWrapper>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <FormFieldWrapper label="Lokasi" error={form.formState.errors.location?.message}>
            <Input placeholder="Contoh: Aula Utama Masjid" {...form.register("location")} />
          </FormFieldWrapper>
          <FormFieldWrapper
            label="Penanggung Jawab"
            error={form.formState.errors.personInCharge?.message}
          >
            <Input placeholder="Nama pengurus atau panitia" {...form.register("personInCharge")} />
          </FormFieldWrapper>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <FormFieldWrapper
            label="Status Kegiatan"
            error={form.formState.errors.status?.message}
            hint="Pilih 'Tampilkan' agar muncul di website"
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
                <SelectItem value="PUBLISHED">Tampilkan ke Publik</SelectItem>
                <SelectItem value="COMPLETED">Sudah Selesai</SelectItem>
                <SelectItem value="CANCELLED">Dibatalkan</SelectItem>
              </SelectContent>
            </Select>
          </FormFieldWrapper>
          <FormFieldWrapper
            label="Link Poster (opsional)"
            error={form.formState.errors.posterUrl?.message}
            hint="Tempel link gambar poster kegiatan"
          >
            <Input placeholder="https://drive.google.com/..." {...form.register("posterUrl")} />
          </FormFieldWrapper>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <FormFieldWrapper label="Tampilkan di Website" hint="Aktifkan agar jamaah bisa melihat kegiatan ini">
            <div className="flex h-10 items-center gap-3 rounded-xl border border-border px-3">
              <Switch
                checked={isPublic}
                onCheckedChange={(checked) => form.setValue("isPublic", checked)}
              />
              <span className="text-sm text-muted-foreground">{isPublic ? "Ya, tampilkan" : "Tidak ditampilkan"}</span>
            </div>
          </FormFieldWrapper>
          <FormFieldWrapper label="Tandai sebagai Unggulan" hint="Kegiatan unggulan tampil lebih menonjol">
            <div className="flex h-10 items-center gap-3 rounded-xl border border-border px-3">
              <Switch
                checked={isFeatured}
                onCheckedChange={(checked) => form.setValue("isFeatured", checked)}
              />
              <span className="text-sm text-muted-foreground">{isFeatured ? "Ya, unggulan" : "Tidak"}</span>
            </div>
          </FormFieldWrapper>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={isPending} className="button-brand">
            {isPending ? (
              <>
                <LoaderCircle className="size-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              "Simpan Agenda"
            )}
          </Button>
          {selectedEvent ? (
            <ConfirmDialog
              title="Hapus agenda?"
              description="Agenda yang dihapus tidak akan lagi tampil di dashboard maupun halaman publik."
              confirmLabel="Hapus Agenda"
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
