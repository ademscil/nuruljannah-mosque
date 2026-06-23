"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, Clock, FileText, Sparkles, Trash2, User, UserRoundCheck } from "lucide-react";
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
    <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-br from-background via-background to-muted/20 shadow-depth-lg backdrop-blur-sm">
      {/* Decorative gradient overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5" />

      <div className="relative space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20">
            <Sparkles className="size-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight text-foreground">
              Tambah / Edit Jadwal
            </h2>
            <p className="text-sm text-muted-foreground">
              Pilih jadwal yang ingin diedit, atau tambahkan jadwal petugas baru
            </p>
          </div>
        </div>

        {/* Selection Section */}
        <div className="rounded-2xl border border-border/50 bg-card/30 p-5 backdrop-blur-sm">
          <FormFieldWrapper
            label="Pilih Jadwal"
            hint="Pilih 'Tambah Baru' untuk membuat jadwal baru"
          >
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

        <form className="space-y-6" onSubmit={form.handleSubmit(handleSubmit)}>
          {/* Basic Info Section */}
          <div className="space-y-4 rounded-2xl border border-border/50 bg-card/30 p-5 backdrop-blur-sm">
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20">
                <FileText className="size-4 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold tracking-tight text-foreground">
                Informasi Kegiatan
              </h3>
            </div>

            <FormFieldWrapper
              label="Nama Kegiatan / Sholat"
              error={form.formState.errors.title?.message}
            >
              <Input
                placeholder="Contoh: Sholat Jumat, Pengajian Ahad"
                {...form.register("title")}
              />
            </FormFieldWrapper>

            <FormFieldWrapper
              label="Jenis Petugas"
              error={form.formState.errors.roleType?.message}
            >
              <div className="relative">
                <UserRoundCheck className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Select
                  value={selectedRole}
                  onValueChange={(value) =>
                    form.setValue(
                      "roleType",
                      (value ?? "IMAM") as ScheduleFormSchema["roleType"],
                    )
                  }
                >
                  <SelectTrigger className="pl-10">
                    <SelectValue placeholder="Pilih jenis petugas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IMAM">Imam</SelectItem>
                    <SelectItem value="MUADZIN">Muadzin</SelectItem>
                    <SelectItem value="KHATIB">Khatib</SelectItem>
                    <SelectItem value="PETUGAS_KEGIATAN">Petugas Kegiatan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </FormFieldWrapper>
          </div>

          {/* Schedule Details Section */}
          <div className="space-y-4 rounded-2xl border border-border/50 bg-card/30 p-5 backdrop-blur-sm">
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/20">
                <Calendar className="size-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="font-semibold tracking-tight text-foreground">
                Detail Jadwal & Petugas
              </h3>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormFieldWrapper
                label="Tanggal & Jam"
                error={form.formState.errors.scheduleFor?.message}
              >
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="datetime-local"
                    className="pl-10"
                    {...form.register("scheduleFor")}
                  />
                </div>
              </FormFieldWrapper>

              <FormFieldWrapper
                label="Keterangan Waktu"
                error={form.formState.errors.timeLabel?.message}
                hint="Contoh: Subuh, Dzuhur, 08.00 WIB"
              >
                <Input
                  placeholder="Contoh: Subuh"
                  {...form.register("timeLabel")}
                />
              </FormFieldWrapper>
            </div>

            <FormFieldWrapper
              label="Nama Petugas"
              error={form.formState.errors.personName?.message}
            >
              <div className="relative">
                <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Nama lengkap petugas"
                  className="pl-10"
                  {...form.register("personName")}
                />
              </div>
            </FormFieldWrapper>
          </div>

          {/* Notes Section */}
          <div className="space-y-4 rounded-2xl border border-border/50 bg-card/30 p-5 backdrop-blur-sm">
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20">
                <FileText className="size-4 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="font-semibold tracking-tight text-foreground">
                Catatan Tambahan
              </h3>
            </div>

            <FormFieldWrapper
              label="Catatan"
              hint="Opsional — informasi tambahan untuk petugas"
            >
              <Textarea
                rows={3}
                placeholder="Contoh: Harap hadir 15 menit sebelumnya"
                {...form.register("notes")}
              />
            </FormFieldWrapper>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <ConfirmSubmitButton
              title="Simpan jadwal petugas?"
              description="Data jadwal akan dipakai pada dashboard dan halaman publik."
              label="Simpan Jadwal"
              pendingLabel="Menyimpan..."
              isPending={isPending}
              onConfirm={() => form.handleSubmit(handleSubmit)()}
            />
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
    </div>
  );
}
