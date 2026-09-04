"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { User, Phone, Calendar } from "lucide-react";
import { useTransition, useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { FormFieldWrapper } from "@/components/shared/form-field-wrapper";
import { SmartImageUploader } from "@/components/shared/smart-image-uploader";
import { useAutoSaveDraft } from "@/hooks/use-autosave-draft";
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
import { saveManagementMemberAction } from "@/features/management/services/management-actions";
import {
  managementFormSchema,
  type ManagementFormSchema,
} from "@/features/management/schemas/management-form-schema";
import type { ManagementMemberItem } from "@/features/management/types/management";

type ManagementFormModalProps = {
  member?: ManagementMemberItem;
  trigger: React.ReactElement;
  onSuccess?: () => void;
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

export function ManagementFormModal({ member, trigger, onSuccess }: ManagementFormModalProps) {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const form = useForm<ManagementFormSchema>({
    resolver: zodResolver(managementFormSchema),
    defaultValues: getDefaultValues(member),
  });

  const formKey = member?.id ? ("draft_management_" + member.id) : "draft_management_new";
  const photoUrlValue = useWatch({ control: form.control, name: "photoUrl" });
  const { clearDraft } = useAutoSaveDraft({
    key: formKey,
    watch: form.watch,
    isDirty: form.formState.isDirty,
    onRestore: (saved) => {
      form.reset({ ...getDefaultValues(member), ...saved });
      toast.info("Draf data pengurus berhasil dipulihkan.");
    },
  });

  const selectedStatus = useWatch({
    control: form.control,
    name: "status",
  });

  useEffect(() => {
    if (open) {
      form.reset(getDefaultValues(member));
    }
  }, [open, member, form]);

  const handleSubmit = (values: ManagementFormSchema) => {
    startTransition(async () => {
      const result = await saveManagementMemberAction(values);
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      clearDraft();
      toast.success(result.message);
      setOpen(false);
      onSuccess?.();
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />
      <DialogContent size="xl" className="max-h-[90vh] overflow-y-auto">
        <DialogTitle>{member ? "Edit Data Pengurus" : "Tambah Pengurus Baru"}</DialogTitle>
        <DialogDescription>
          {member
            ? "Perbarui informasi pengurus yang ada."
            : "Tambahkan data pengurus baru untuk organisasi masjid."}
        </DialogDescription>

        <form className="space-y-5" onSubmit={form.handleSubmit(handleSubmit)}>
          {/* Personal Info Section */}
          <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-muted/30 to-muted/10 p-5 backdrop-blur-sm">
            <div className="mb-4 flex items-center gap-2">
              <User className="size-4 text-muted-foreground" />
              <span className="text-sm font-semibold text-foreground">Informasi Pribadi</span>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <FormFieldWrapper label="Nama Lengkap" error={form.formState.errors.name?.message}>
                <Input placeholder="Nama lengkap pengurus" {...form.register("name")} />
              </FormFieldWrapper>
              <FormFieldWrapper label="Jabatan" error={form.formState.errors.position?.message}>
                <Input
                  placeholder="Contoh: Ketua, Sekretaris, Bendahara"
                  {...form.register("position")}
                />
              </FormFieldWrapper>
            </div>
          </div>

          {/* Contact Info Section */}
          <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-muted/30 to-muted/10 p-5 backdrop-blur-sm">
            <div className="mb-4 flex items-center gap-2">
              <Phone className="size-4 text-muted-foreground" />
              <span className="text-sm font-semibold text-foreground">Informasi Kontak</span>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <FormFieldWrapper label="Nomor HP (opsional)">
                <Input placeholder="08xxxxxxxxxx" {...form.register("phone")} />
              </FormFieldWrapper>
              <FormFieldWrapper label="Email (opsional)" error={form.formState.errors.email?.message}>
                <Input placeholder="email@contoh.com" {...form.register("email")} />
              </FormFieldWrapper>
            </div>
          </div>

          {/* Term & Photo Section */}
          <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-muted/30 to-muted/10 p-5 backdrop-blur-sm">
            <div className="mb-4 flex items-center gap-2">
              <Calendar className="size-4 text-muted-foreground" />
              <span className="text-sm font-semibold text-foreground">Periode & Foto</span>
            </div>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
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
                label="Foto Pengurus (opsional)"
                error={form.formState.errors.photoUrl?.message}
                hint="Format foto otomatis dikonversi ke WebP ringan (<150KB)"
              >
                <SmartImageUploader
                  value={photoUrlValue ?? ""}
                  onChange={(url) => form.setValue("photoUrl", url, { shouldValidate: true, shouldDirty: true })}
                  folder="management"
                  aspectRatio="1:1"
                />
              </FormFieldWrapper>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
              Batal
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Menyimpan..." : member ? "Simpan Perubahan" : "Tambah Pengurus"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
