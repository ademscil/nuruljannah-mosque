"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { FormFieldWrapper } from "@/components/shared/form-field-wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  saveAccountSettingsAction,
} from "@/features/settings/services/account-settings-actions";
import {
  accountSettingsSchema,
  type AccountSettingsSchema,
} from "@/features/settings/schemas/account-settings-schema";

type AccountSettingsFormProps = {
  initialValues: {
    name: string;
    email: string;
    phone: string;
    roleLabel: string;
  };
};

export function AccountSettingsForm({
  initialValues,
}: AccountSettingsFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<AccountSettingsSchema>({
    resolver: zodResolver(accountSettingsSchema),
    defaultValues: {
      name: initialValues.name,
      email: initialValues.email,
      phone: initialValues.phone,
      password: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = (values: AccountSettingsSchema) => {
    startTransition(async () => {
      const result = await saveAccountSettingsAction(values);
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      toast.success(result.message);
      form.reset({
        ...values,
        password: "",
        confirmPassword: "",
      });
    });
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      <form className="card-elevated p-6" onSubmit={form.handleSubmit(handleSubmit)}>
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Profil Akun</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Perbarui identitas akun admin dan kata sandi jika diperlukan.
          </p>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <FormFieldWrapper label="Nama" error={form.formState.errors.name?.message}>
            <Input {...form.register("name")} />
          </FormFieldWrapper>
          <FormFieldWrapper label="Email" error={form.formState.errors.email?.message}>
            <Input {...form.register("email")} />
          </FormFieldWrapper>
          <FormFieldWrapper label="Nomor HP">
            <Input {...form.register("phone")} />
          </FormFieldWrapper>
          <FormFieldWrapper label="Password Baru" error={form.formState.errors.password?.message}>
            <Input type="password" {...form.register("password")} />
          </FormFieldWrapper>
          <FormFieldWrapper
            label="Konfirmasi Password"
            error={form.formState.errors.confirmPassword?.message}
            className="md:col-span-2"
          >
            <Input type="password" {...form.register("confirmPassword")} />
          </FormFieldWrapper>
        </div>

        <div className="mt-6">
          <Button type="submit" disabled={isPending} className="button-brand">
            {isPending ? (
              <>
                <LoaderCircle className="size-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              "Simpan Pengaturan Akun"
            )}
          </Button>
        </div>
      </form>

      <div className="card-elevated p-6">
        <div className="badge-primary mb-4">Ringkasan Akses</div>
        <h3 className="mt-3 text-xl font-semibold tracking-tight">{initialValues.name}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{initialValues.email}</p>
        <div className="mt-5 rounded-xl border border-border bg-muted/30 p-4">
          <p className="text-sm text-muted-foreground">Role aktif</p>
          <p className="mt-2 font-medium">{initialValues.roleLabel}</p>
        </div>
      </div>
    </div>
  );
}
