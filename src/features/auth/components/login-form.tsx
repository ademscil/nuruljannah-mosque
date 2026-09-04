"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  Mail,
  Shield,
  Wallet,
  FileSpreadsheet,
  ArrowRight,
} from "lucide-react";
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

const isDevelopment = process.env.NODE_ENV !== "production";

const QUICK_ROLES = [
  {
    roleName: "Admin Utama",
    email: "admin@nuruljannah.id",
    pass: "Admin123!",
    icon: Shield,
    badgeColor: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
  },
  {
    roleName: "Bendahara",
    email: "bendahara@nuruljannah.id",
    pass: "Admin123!",
    icon: Wallet,
    badgeColor: "bg-amber-500/10 text-amber-700 border-amber-500/20",
  },
  {
    roleName: "Sekretaris",
    email: "sekretaris@nuruljannah.id",
    pass: "Admin123!",
    icon: FileSpreadsheet,
    badgeColor: "bg-blue-500/10 text-blue-700 border-blue-500/20",
  },
];

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>("Admin Utama");

  const callbackUrl = searchParams.get("callbackUrl") ?? ROUTE_PATHS.dashboard;

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSelectRole = (role: typeof QUICK_ROLES[number]) => {
    setSelectedRole(role.roleName);
    form.setValue("email", role.email, { shouldValidate: true });
    form.setValue("password", role.pass, { shouldValidate: true });
    toast.info(`Akun ${role.roleName} dipilih`, {
      description: role.email,
    });
  };

  const onSubmit = (values: LoginSchema) => {
    startTransition(async () => {
      try {
        const result = await signIn("credentials", {
          email: values.email.trim(),
          password: values.password,
          redirect: false,
          callbackUrl,
        });

        if (!result || result.error) {
          toast.error("Email atau kata sandi tidak valid. Silakan periksa kembali.");
          return;
        }

        toast.success("Login berhasil! Mengarahkan ke CMS...");
        router.push(result.url ?? callbackUrl);
        router.refresh();
      } catch (err) {
        console.error("Login submission error:", err);
        toast.error("Terjadi kendala jaringan saat login. Silakan coba lagi.");
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* 1-Click Role Quick Fill for DKM Administrators (Development only) */}
      {isDevelopment && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
              Pilih Akses Cepat Demo (Dev Only)
            </p>
            <span className="text-[11px] text-primary font-medium">Auto-fill akun</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {QUICK_ROLES.map((role) => {
              const isSelected = selectedRole === role.roleName;
              const Icon = role.icon;
              return (
                <button
                  key={role.roleName}
                  type="button"
                  onClick={() => handleSelectRole(role)}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border text-center transition-all ${
                    isSelected
                      ? "border-primary bg-primary/10 shadow-sm ring-1 ring-primary/40 font-semibold"
                      : "border-border/60 bg-muted/30 hover:bg-muted/60 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className={`size-4 mb-1 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                  <span className="text-xs">{role.roleName}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="relative flex items-center justify-center">
        <div className="w-full border-t border-border/60" />
        <span className="bg-card px-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Atau Masukkan Manual
        </span>
      </div>

      <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
        <FormFieldWrapper
          label="Email Pengurus"
          error={form.formState.errors.email?.message}
        >
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="email"
              autoComplete="email"
              placeholder="admin@nuruljannah.id"
              className="h-12 rounded-2xl pl-10 border-border/80 focus:border-primary"
              {...form.register("email")}
            />
          </div>
        </FormFieldWrapper>

        <FormFieldWrapper
          label="Kata Sandi"
          error={form.formState.errors.password?.message}
          hint="Gunakan sandi akun terdaftar atau klik pilihan role di atas."
        >
          <div className="relative">
            <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Masukkan kata sandi"
              className="h-12 rounded-2xl pl-10 pr-11 border-border/80 focus:border-primary"
              {...form.register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </FormFieldWrapper>

        <Button
          type="submit"
          disabled={isPending}
          className="h-12 w-full rounded-2xl bg-primary text-base font-semibold text-primary-foreground shadow-depth-md transition-all hover:bg-primary/95 hover:shadow-depth-lg active:scale-[0.98]"
        >
          {isPending ? (
            <>
              <LoaderCircle className="size-4 animate-spin mr-2" />
              Memverifikasi Kredensial...
            </>
          ) : (
            <>
              Masuk ke Dashboard
              <ArrowRight className="size-4 ml-2" />
            </>
          )}
        </Button>

        <div className="pt-2 text-center text-xs text-muted-foreground">
          Kembali ke{" "}
          <Link
            href={ROUTE_PATHS.home}
            className="font-semibold text-primary underline-offset-4 hover:underline"
          >
            Beranda Portal Publik
          </Link>
        </div>
      </form>
    </div>
  );
}
