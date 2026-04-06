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
  deleteManagementMemberAction,
  saveManagementMemberAction,
} from "@/features/management/services/management-actions";
import {
  managementFormSchema,
  type ManagementFormSchema,
} from "@/features/management/schemas/management-form-schema";
import type { ManagementMemberItem } from "@/features/management/types/management";

type ManagementFormPanelProps = {
  members: ManagementMemberItem[];
};

function getDefaultValues(member?: ManagementMemberItem): ManagementFormSchema {
  return {
    id: member?.id,
    name: member?.name ?? "",
    position: member?.position ?? "",
    phone: member?.phone ?? "",
    email: member?.email ?? "",
    termPeriod: member?.termPeriod ?? "",
    photoUrl: member?.photoUrl ?? "",
    status: member?.status ?? "PUBLISHED",
  };
}

export function ManagementFormPanel({ members }: ManagementFormPanelProps) {
  const [selectedId, setSelectedId] = useState("new");
  const [isPending, startTransition] = useTransition();

  const selectedMember = useMemo(
    () => members.find((item) => item.id === selectedId),
    [members, selectedId],
  );

  const form = useForm<ManagementFormSchema>({
    resolver: zodResolver(managementFormSchema),
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
    const member = members.find((item) => item.id === id);
    form.reset(getDefaultValues(member));
  };

  const handleSubmit = (values: ManagementFormSchema) => {
    startTransition(async () => {
      const result = await saveManagementMemberAction(values);
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      toast.success(result.message);
      if (selectedId === "new") resetSelection("new");
    });
  };

  const handleDelete = () => {
    if (!selectedMember) return;
    startTransition(async () => {
      const result = await deleteManagementMemberAction(selectedMember.id);
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
          <h2 className="text-lg font-semibold tracking-tight">Tambah / Edit Data Pengurus</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Pilih pengurus yang ingin diedit, atau tambahkan data pengurus baru.
          </p>
        </div>
        <FormFieldWrapper label="Pilih Pengurus" hint="Pilih 'Tambah Baru' untuk menambah data pengurus baru">
          <Select value={selectedId} onValueChange={resetSelection}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih pengurus" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">+ Tambah Pengurus Baru</SelectItem>
              {members.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormFieldWrapper>
      </div>
      <form className="mt-6 space-y-5" onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="grid gap-5 md:grid-cols-2">
          <FormFieldWrapper label="Nama Lengkap" error={form.formState.errors.name?.message}>
            <Input placeholder="Nama lengkap pengurus" {...form.register("name")} />
          </FormFieldWrapper>
          <FormFieldWrapper label="Jabatan" error={form.formState.errors.position?.message}>
            <Input placeholder="Contoh: Ketua, Sekretaris, Bendahara" {...form.register("position")} />
          </FormFieldWrapper>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <FormFieldWrapper label="Nomor HP (opsional)">
            <Input placeholder="08xxxxxxxxxx" {...form.register("phone")} />
          </FormFieldWrapper>
          <FormFieldWrapper label="Email (opsional)" error={form.formState.errors.email?.message}>
            <Input placeholder="email@contoh.com" {...form.register("email")} />
          </FormFieldWrapper>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <FormFieldWrapper
            label="Periode Kepengurusan"
            error={form.formState.errors.termPeriod?.message}
            hint="Contoh: 2023 - 2026"
          >
            <Input placeholder="2023 - 2026" {...form.register("termPeriod")} />
          </FormFieldWrapper>
          <FormFieldWrapper
            label="Status Tampil"
            error={form.formState.errors.status?.message}
            hint="Pilih 'Tampilkan' agar muncul di halaman pengurus"
          >
            <Select
              value={selectedStatus}
              onValueChange={(value) =>
                form.setValue(
                  "status",
                  (value ?? "PUBLISHED") as ManagementFormSchema["status"],
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DRAFT">Simpan sebagai Draf</SelectItem>
                <SelectItem value="PUBLISHED">Tampilkan di Website</SelectItem>
                <SelectItem value="ARCHIVED">Arsipkan</SelectItem>
              </SelectContent>
            </Select>
          </FormFieldWrapper>
        </div>
        <FormFieldWrapper
          label="Link Foto (opsional)"
          error={form.formState.errors.photoUrl?.message}
          hint="Tempel link foto dari Google Drive atau layanan lain"
        >
          <Input placeholder="https://drive.google.com/..." {...form.register("photoUrl")} />
        </FormFieldWrapper>
        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={isPending} className="button-brand">
            {isPending ? (
              <>
                <LoaderCircle className="size-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              "Simpan Pengurus"
            )}
          </Button>
          {selectedMember ? (
            <ConfirmDialog
              title="Hapus data pengurus?"
              description="Data pengurus yang dihapus tidak akan lagi tampil di halaman profil masjid."
              confirmLabel="Hapus Pengurus"
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
