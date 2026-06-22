import { redirect } from "next/navigation";
import { Building2, ShieldCheck, Users, LayoutGrid } from "lucide-react";

import { auth } from "@/auth";
import { ROUTE_PATHS } from "@/constants/routes";
import { LoginForm } from "@/features/auth/components/login-form";
import { SITE_CONFIG } from "@/constants/site";
import { Card3D } from "@/components/shared/card-3d";

const features = [
  { icon: LayoutGrid, text: "Dashboard ringkasan operasional masjid" },
  { icon: Users, text: "Manajemen pengurus dengan role-based access" },
  { icon: ShieldCheck, text: "CMS konten publik terintegrasi penuh" },
];

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) redirect(ROUTE_PATHS.dashboard);

  return (
    <div className="gradient-mesh-primary min-h-screen">
      <div className="mx-auto grid min-h-screen max-w-[88rem] gap-0 lg:grid-cols-[1fr_1fr]">

        {/* Left — dark panel */}
        <section className="relative hidden overflow-hidden bg-[oklch(0.2_0.04_175)] lg:flex lg:flex-col lg:justify-between p-12">
          <div className="orb -left-16 -top-16 size-72 bg-primary/15 animate-float-slow" />
          <div className="orb -bottom-12 right-0 size-56 bg-[oklch(0.68_0.14_82)]/10 animate-float-medium" />

          {/* Logo */}
          <div className="relative flex items-center gap-3 animate-fade-up">
            <div className="flex size-10 items-center justify-center rounded-xl bg-[oklch(0.68_0.14_82)] text-[oklch(0.15_0.02_250)] shadow-depth-lg transition-transform duration-300 hover:scale-110">
              <Building2 className="size-5" />
            </div>
            <div>
              <p className="font-bold text-white">{SITE_CONFIG.name}</p>
              <p className="text-xs text-[oklch(0.6_0.04_175)]">Portal Admin</p>
            </div>
          </div>

          {/* Headline */}
          <div className="relative space-y-6 animate-fade-up [animation-delay:100ms]">
            <h1 className="font-heading text-4xl font-semibold leading-tight text-white xl:text-5xl">
              CMS internal masjid siap dipakai pengurus.
            </h1>
            <p className="max-w-sm text-base leading-8 text-[oklch(0.68_0.03_175)]">
              Kelola konten publik, jadwal petugas, keuangan, dan donasi dari satu dashboard yang terhubung langsung ke database.
            </p>
            <ul className="space-y-3">
              {features.map((f, i) => (
                <li key={f.text} style={{ animationDelay: `${200 + i * 80}ms` }} className="animate-fade-up flex items-center gap-3 text-sm text-[oklch(0.72_0.03_175)]">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-[oklch(0.28_0.05_175)] transition-transform duration-300 hover:scale-110">
                    <f.icon className="size-3.5 text-[oklch(0.68_0.14_82)]" />
                  </div>
                  {f.text}
                </li>
              ))}
            </ul>
          </div>

          {/* Seed info */}
          <div className="relative grid gap-3 sm:grid-cols-2 animate-fade-up [animation-delay:400ms]">
            <div className="interactive-3d rounded-2xl border border-[oklch(0.3_0.04_175)] bg-[oklch(0.26_0.04_175)] p-5 transition-all duration-300 hover:border-[oklch(0.68_0.14_82)]/30">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[oklch(0.68_0.14_82)]">Akun Demo</p>
              <p className="mt-3 text-xs text-[oklch(0.6_0.03_175)]">Email</p>
              <p className="mt-1 text-sm font-semibold text-white">admin@nuruljannah.id</p>
              <p className="mt-2 text-xs text-[oklch(0.6_0.03_175)]">Password</p>
              <p className="mt-1 text-sm font-semibold text-white">Admin123!</p>
            </div>
            <div className="interactive-3d rounded-2xl border border-[oklch(0.3_0.04_175)] bg-[oklch(0.26_0.04_175)] p-5 transition-all duration-300 hover:border-[oklch(0.68_0.14_82)]/30">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[oklch(0.68_0.14_82)]">Role Tersedia</p>
              <ul className="mt-3 space-y-1.5 text-sm text-[oklch(0.68_0.03_175)]">
                <li>Admin Utama</li>
                <li>Bendahara</li>
                <li>Sekretaris</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Right — form */}
        <section className="flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md space-y-8">
            {/* Mobile logo */}
            <div className="animate-fade-up flex items-center gap-3 lg:hidden">
              <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-depth-md transition-transform duration-300 hover:scale-110">
                <Building2 className="size-4" />
              </div>
              <p className="font-bold">{SITE_CONFIG.name}</p>
            </div>

            <div className="animate-fade-up space-y-2 [animation-delay:100ms]">
              <div className="badge-primary transition-transform duration-300 hover:scale-105">Masuk ke Dashboard</div>
              <h2 className="font-heading text-3xl font-semibold tracking-tight text-gradient">
                Login pengurus
              </h2>
              <p className="text-sm leading-7 text-muted-foreground">
                Gunakan akun pengurus yang terdaftar di database untuk mengakses CMS internal.
              </p>
            </div>

            <Card3D variant="glass" className="animate-fade-up p-8 [animation-delay:200ms]">
              <LoginForm />
            </Card3D>
          </div>
        </section>

      </div>
    </div>
  );
}
