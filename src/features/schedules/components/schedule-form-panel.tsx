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
  deleteScheduleAction,
  saveScheduleAction,
} from "@/features/schedules/services/schedule-actions";
import {
  scheduleFormSchema,
  type ScheduleFormSchema,
} from "@/features/schedules/schemas/schedule-form-schema";
import type { ScheduleListItem } from "@/features/schedules/types/schedule";

type ScheduleFormPanelProps = {
  schedules: ScheduleListItem[];
};

function getDefaultValues(schedule?: ScheduleListItem): ScheduleFormSchema {
  return {
    id: schedule?.id,
    title: schedule?.title ?? "",
    roleType: schedule?.roleType ?? "IMAM",
    scheduleFor: schedule?.scheduleFor ? schedule.scheduleFor.slice(0, 16) : "",
    timeLabel: schedule?.timeLabel ?? "",
    personName: schedule?.personName ?? "",
    notes: schedule?.notes ?? "",
  };
}

export function ScheduleFormPanel({ schedules }: ScheduleFormPanelProps) {
  const [selectedId, setSelectedId] = useState("new");
  const [isPending, startTransition] = useTransition();

  const selectedSchedule = useMemo(
    () => schedules.find((item) => item.id === selectedId),
    [schedules, selectedId],
  );

  const form = useForm<ScheduleFormSchema>({
    resolver: zodResolver(scheduleFormSchema),
    defaultValues: getDefaultValues(),
  });
  const selectedRole = useWatch({
    control: form.control,
    name: "roleType",
  });

  const resetSelection = (id: string | null) => {
    if (!id) {
      return;
    }

    setSelectedId(id);
    const schedule = schedules.find((item) => item.id === id);
    form.reset(getDefaultValues(schedule));
  };

  const handleSubmit = (values: ScheduleFormSchema) => {
    startTransition(async () => {
      const result = await saveScheduleAction(values);
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      toast.success(result.message);
      if (selectedId === "new") resetSelection("new");
    });
  };

  const handleDelete = () => {
    if (!selectedSchedule) return;
    startTransition(async () => {
      const result = await deleteScheduleAction(selectedSchedule.id);
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
          <h2 className="text-lg font-semibold tracking-tight">Tambah / Edit Jadwal</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Pilih jadwal yang ingin diedit, atau tambahkan jadwal petugas baru.
          </p>
        </div>
        <FormFieldWrapper label="Pilih Jadwal" hint="Pilih 'Tambah Baru' untuk membuat jadwal baru">
          <Select value={selectedId} onValueChange={resetSelection}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih jadwal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">+ Tambah Jadwal Baru</SelectItem>
              {schedules.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormFieldWrapper>
      </div>

      <form className="mt-6 space-y-5" onSubmit={form.handleSubmit(handleSubmit)}>
        <FormFieldWrapper label="Nama Kegiatan / Sholat" error={form.formState.errors.title?.message}>
          <Input placeholder="Contoh: Sholat Jumat, Pengajian Ahad" {...form.register("title")} />
        </FormFieldWrapper>
        <div className="grid gap-5 md:grid-cols-2">
          <FormFieldWrapper
            label="Jenis Petugas"
            error={form.formState.errors.roleType?.message}
          >
            <Select
              value={selectedRole}
              onValueChange={(value) =>
                form.setValue(
                  "roleType",
                  (value ?? "IMAM") as ScheduleFormSchema["roleType"],
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih jenis petugas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="IMAM">Imam</SelectItem>
                <SelectItem value="MUADZIN">Muadzin</SelectItem>
                <SelectItem value="KHATIB">Khatib</SelectItem>
                <SelectItem value="PETUGAS_KEGIATAN">Petugas Kegiatan</SelectItem>
              </SelectContent>
            </Select>
          </FormFieldWrapper>
          <FormFieldWrapper
            label="Tanggal & Jam"
            error={form.formState.errors.scheduleFor?.message}
          >
            <Input type="datetime-local" {...form.register("scheduleFor")} />
          </FormFieldWrapper>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <FormFieldWrapper
            label="Keterangan Waktu"
            error={form.formState.errors.timeLabel?.message}
            hint="Contoh: Subuh, Dzuhur, 08.00 WIB"
          >
            <Input placeholder="Contoh: Subuh" {...form.register("timeLabel")} />
          </FormFieldWrapper>
          <FormFieldWrapper
            label="Nama Petugas"
            error={form.formState.errors.personName?.message}
          >
            <Input placeholder="Nama lengkap petugas" {...form.register("personName")} />
          </FormFieldWrapper>
        </div>
        <FormFieldWrapper label="Catatan Tambahan" hint="Opsional — informasi tambahan untuk petugas">
          <Textarea rows={3} placeholder="Contoh: Harap hadir 15 menit sebelumnya" {...form.register("notes")} />
        </FormFieldWrapper>
        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={isPending} className="button-brand">
            {isPending ? (
              <>
                <LoaderCircle className="size-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              "Simpan Jadwal"
            )}
          </Button>
          {selectedSchedule ? (
            <ConfirmDialog
              title="Hapus jadwal petugas?"
              description="Jadwal yang dihapus akan hilang dari dashboard dan papan jadwal publik."
              confirmLabel="Hapus Jadwal"
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
