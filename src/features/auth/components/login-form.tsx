"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LoaderCircle, LockKeyhole, Mail } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { FormFieldWrapper } from "@/components/shared/form-field-wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ROUTE_PATHS } from "@/constants/routes";
import {
  loginSchema,
  type LoginSchema,
} from "@/features/auth/schemas/login-schema";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);

  const callbackUrl = searchParams.get("callbackUrl") ?? ROUTE_PATHS.dashboard;

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "admin@nuruljannah.id",
      password: "Admin123!",
    },
  });

  const onSubmit = (values: LoginSchema) => {
    startTransition(async () => {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        toast.error("Email atau kata sandi tidak valid.");
        return;
      }

      toast.success("Login berhasil. Mengarahkan ke dashboard...");
      router.push(result?.url ?? callbackUrl);
      router.refresh();
    });
  };

  return (
    <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
      <FormFieldWrapper
        label="Email"
        error={form.formState.errors.email?.message}
      >
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="email"
            autoComplete="email"
            placeholder="admin@nuruljannah.id"
            className="h-12 rounded-2xl pl-10"
            {...form.register("email")}
          />
        </div>
      </FormFieldWrapper>

      <FormFieldWrapper
        label="Kata sandi"
        error={form.formState.errors.password?.message}
        hint="Gunakan akun hasil seed database untuk login."
      >
        <div className="relative">
          <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Masukkan kata sandi"
            className="h-12 rounded-2xl pl-10 pr-11"
            {...form.register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </FormFieldWrapper>

      <Button
        type="submit"
        disabled={isPending}
        className="h-12 w-full rounded-2xl bg-primary text-base text-primary-foreground hover:bg-primary/95"
      >
        {isPending ? (
          <>
            <LoaderCircle className="size-4 animate-spin" />
            Memproses...
          </>
        ) : (
          "Masuk ke Dashboard"
        )}
      </Button>

      <p className="text-sm leading-6 text-muted-foreground">
        Gunakan akun pengurus yang sudah terdaftar di database untuk masuk ke
        dashboard admin.
      </p>

      <p className="text-sm text-muted-foreground">
        Kembali ke{" "}
        <Link href={ROUTE_PATHS.home} className="font-medium text-primary">
          beranda publik
        </Link>
        .
      </p>
    </form>
  );
}
