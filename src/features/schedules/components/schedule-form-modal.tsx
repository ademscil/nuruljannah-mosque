"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  FileText,
  Calendar,
  Clock,
  User,
  UserRoundCheck,
  Plus,
  Pencil,
} from "lucide-react";
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
import { saveScheduleAction } from "@/features/schedules/services/schedule-actions";
import {
  scheduleFormSchema,
  type ScheduleFormSchema,
} from "@/features/schedules/schemas/schedule-form-schema";
import type { ScheduleListItem } from "@/features/schedules/types/schedule";

type ScheduleFormModalProps = {
  schedule?: ScheduleListItem;
  mode?: "create" | "edit";
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

export function ScheduleFormModal({
  schedule,
  mode = "create",
}: ScheduleFormModalProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<ScheduleFormSchema>({
    resolver: zodResolver(scheduleFormSchema),
    defaultValues: getDefaultValues(schedule),
  });

  const selectedRole = useWatch({
    control: form.control,
    name: "roleType",
  });

  // Reset form when modal opens/closes or schedule changes
  useEffect(() => {
    if (open) {
      form.reset(getDefaultValues(schedule));
    }
  }, [open, schedule, form]);

  const handleSubmit = (values: ScheduleFormSchema) => {
    startTransition(async () => {
      const result = await saveScheduleAction(values);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      setOpen(false);
      form.reset();
    });
  };

  const triggerButton =
    mode === "create" ? (
      <Button size="default">
        <Plus className="h-4 w-4" />
        Tambah Jadwal
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
            {mode === "create" ? "Tambah Jadwal Baru" : "Edit Jadwal"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Isi form di bawah untuk membuat jadwal petugas baru"
              : "Perbarui informasi jadwal petugas"}
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-5" onSubmit={form.handleSubmit(handleSubmit)}>
          {/* Basic Info Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <FileText className="h-4 w-4 text-primary" />
              <span>Informasi Kegiatan</span>
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
                <UserRoundCheck className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
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
                    <SelectItem value="PETUGAS_KEGIATAN">
                      Petugas Kegiatan
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </FormFieldWrapper>
          </div>

          {/* Schedule Details Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Calendar className="h-4 w-4 text-primary" />
              <span>Detail Jadwal & Petugas</span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormFieldWrapper
                label="Tanggal & Jam"
                error={form.formState.errors.scheduleFor?.message}
              >
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
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
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <Input
                  placeholder="Nama lengkap petugas"
                  className="pl-10"
                  {...form.register("personName")}
                />
              </div>
            </FormFieldWrapper>
          </div>

          {/* Notes Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <FileText className="h-4 w-4 text-primary" />
              <span>Catatan Tambahan</span>
            </div>

            <FormFieldWrapper
              label="Catatan"
              hint="Opsional — informasi tambahan untuk petugas"
            >
              <Textarea
                rows={3}
                placeholder="Contoh: Harap hadir 15 menit sebelumnya"
                {...form.register("notes")}
                className="resize-none"
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
              {isPending ? "Menyimpan..." : "Simpan Jadwal"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
