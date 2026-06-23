"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Sparkles, Shield, Mail, Phone, User } from "lucide-react";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { ConfirmSubmitButton } from "@/components/shared/confirm-submit-button";
import { FormFieldWrapper } from "@/components/shared/form-field-wrapper";
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
      {/* Main Form Card */}
      <form 
        className="glass-ultra rounded-3xl border border-border/50 p-8 shadow-depth-lg backdrop-blur-sm transition-all hover:shadow-depth-xl"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none" />
        
        <div className="relative">
          {/* Header with icon */}
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 shadow-depth-sm">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Profil Akun
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Perbarui identitas akun admin dan kata sandi jika diperlukan.
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <FormFieldWrapper label="Nama" error={form.formState.errors.name?.message}>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input {...form.register("name")} className="pl-10" />
              </div>
            </FormFieldWrapper>
            
            <FormFieldWrapper label="Email" error={form.formState.errors.email?.message}>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input {...form.register("email")} className="pl-10" />
              </div>
            </FormFieldWrapper>
            
            <FormFieldWrapper label="Nomor HP">
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input {...form.register("phone")} className="pl-10" />
              </div>
            </FormFieldWrapper>
            
            <FormFieldWrapper label="Password Baru" error={form.formState.errors.password?.message}>
              <Input type="password" {...form.register("password")} placeholder="••••••••" />
            </FormFieldWrapper>
            
            <FormFieldWrapper
              label="Konfirmasi Password"
              error={form.formState.errors.confirmPassword?.message}
              className="md:col-span-2"
            >
              <Input type="password" {...form.register("confirmPassword")} placeholder="••••••••" />
            </FormFieldWrapper>
          </div>

          {/* Submit Button */}
          <div className="mt-8">
            <ConfirmSubmitButton
              title="Simpan pengaturan akun?"
              description="Pastikan email dan kata sandi baru sudah benar sebelum disimpan."
              label="Simpan Pengaturan Akun"
              pendingLabel="Menyimpan..."
              isPending={isPending}
              onConfirm={() => form.handleSubmit(handleSubmit)()}
            />
          </div>
        </div>
      </form>

      {/* Summary Card */}
      <div className="card-3d-advanced rounded-3xl bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/50 p-8 shadow-depth-lg dark:from-blue-950/20 dark:via-purple-950/10 dark:to-pink-950/10">
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none" />
        
        <div className="relative">
          {/* Badge with Sparkles */}
          <div className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 px-3 py-1.5 text-xs font-medium shadow-depth-sm backdrop-blur-sm border border-blue-500/20">
            <Sparkles className="h-3 w-3 text-blue-600" />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Ringkasan Akses
            </span>
          </div>

          {/* User Info */}
          <div className="mt-6 space-y-1">
            <h3 className="text-2xl font-bold tracking-tight">{initialValues.name}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span>{initialValues.email}</span>
            </div>
          </div>

          {/* Role Card */}
          <div className="mt-6 glass-frosted rounded-2xl border border-border/50 p-5 shadow-depth-md backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 shadow-depth-sm">
                <Shield className="h-5 w-5 text-emerald-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-muted-foreground">Role Aktif</p>
                <p className="mt-1 text-lg font-semibold tracking-tight">{initialValues.roleLabel}</p>
              </div>
            </div>
          </div>

          {/* Info Badge */}
          <div className="mt-6 rounded-xl bg-blue-500/5 border border-blue-500/10 p-4">
            <p className="text-xs text-muted-foreground leading-relaxed">
              Informasi ini menampilkan detail akun admin yang sedang aktif dan role akses yang dimiliki.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
