import { redirect } from "next/navigation";
import {
  Building2,
  ShieldCheck,
  Users,
  LayoutGrid,
  CheckCircle2,
  Lock,
} from "lucide-react";
import Link from "next/link";

import { auth } from "@/auth";
import { ROUTE_PATHS } from "@/constants/routes";
import { LoginForm } from "@/features/auth/components/login-form";
import { SITE_CONFIG } from "@/constants/site";

const highlights = [
  {
    icon: LayoutGrid,
    title: "Dashboard Operasional Modern",
    description: "Monitoring kas masjid, agenda kajian, dan publikasi konten secara terpusat.",
  },
  {
    icon: Users,
    title: "Hak Akses Pengurus (RBAC)",
    description: "Pengaturan wewenang terpisah antara Admin Utama, Bendahara, dan Sekretaris.",
  },
  {
    icon: ShieldCheck,
    title: "Keamanan Sesi & Data Terproteksi",
    description: "Sistem enkripsi sandi terverifikasi untuk keamanan data keuangan dan jamaah.",
  },
];

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) {
    redirect(ROUTE_PATHS.dashboard);
  }

  return (
    <main className="min-h-screen bg-[oklch(0.975_0.01_160)]">
      <div className="mx-auto grid min-h-screen max-w-7xl lg:grid-cols-12">
        {/* Left Branding Column */}
        <section className="relative hidden overflow-hidden bg-gradient-to-br from-[oklch(0.20_0.05_175)] via-[oklch(0.18_0.04_175)] to-[oklch(0.14_0.03_175)] p-12 text-white lg:col-span-6 lg:flex lg:flex-col lg:justify-between xl:col-span-7 xl:p-16">
          {/* Subtle Ambient Orbs */}
          <div className="pointer-events-none absolute -left-20 -top-20 size-80 rounded-full bg-primary/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 right-0 size-72 rounded-full bg-amber-400/10 blur-3xl" />

          {/* Mosque Logo Header */}
          <div className="relative z-10 flex items-center justify-between">
            <Link
              href={ROUTE_PATHS.home}
              className="group flex items-center gap-3.5 transition-transform hover:scale-105"
            >
              <div className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 text-slate-950 shadow-depth-md transition-shadow group-hover:shadow-amber-400/30">
                <Building2 className="size-6" />
              </div>
              <div>
                <p className="font-heading text-lg font-bold tracking-tight text-white">
                  {SITE_CONFIG.name}
                </p>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-300">
                  Portal Admin & CMS
                </p>
              </div>
            </Link>

            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
              <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Sistem Aktif
            </span>
          </div>

          {/* Value Proposition Headline */}
          <div className="relative z-10 my-auto space-y-8 py-10">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-amber-300">
                <Lock className="size-3" />
                Akses Khusus DKM & Pengurus
              </div>
              <h1 className="font-heading text-4xl font-extrabold leading-tight text-white xl:text-5xl">
                Sistem Manajemen Terpadu Masjid Nurul Jannah.
              </h1>
              <p className="max-w-lg text-base leading-relaxed text-emerald-100/80">
                Kelola jadwal sholat otomatis, transparansi laporan kas infaq/shodaqoh, inventaris pengurus, hingga publikasi kegiatan masjid dalam satu pintu.
              </p>
            </div>

            {/* Feature Cards */}
            <div className="space-y-3.5">
              {highlights.map((item) => (
                <div
                  key={item.title}
                  className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md transition-all hover:bg-white/10 hover:border-emerald-400/30"
                >
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300">
                    <item.icon className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{item.title}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-emerald-100/70">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Status Footer */}
          <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-6 text-xs text-emerald-200/60">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-emerald-400" />
              <span>Pangkal Pinang, Kepulauan Bangka Belitung</span>
            </div>
            <span>v2.0 • Clean Architecture</span>
          </div>
        </section>

        {/* Right Authentication Form Column */}
        <section className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:col-span-6 xl:col-span-5 xl:px-14">
          <div className="mx-auto w-full max-w-md space-y-6">
            {/* Mobile Header (Hidden on Desktop) */}
            <div className="flex items-center gap-3 lg:hidden">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-depth-sm">
                <Building2 className="size-5" />
              </div>
              <div>
                <p className="font-heading font-bold text-foreground">{SITE_CONFIG.name}</p>
                <p className="text-xs text-muted-foreground">Portal Admin & CMS</p>
              </div>
            </div>

            {/* Title & Greeting */}
            <div className="space-y-2">
              <h2 className="font-heading text-3xl font-extrabold tracking-tight text-foreground">
                Masuk ke Panel
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Silakan pilih akun pengurus atau masukkan kredensial terdaftar untuk mengelola CMS masjid.
              </p>
            </div>

            {/* Elevated Form Container */}
            <div className="rounded-3xl border border-border/80 bg-card p-7 shadow-depth-lg backdrop-blur-sm sm:p-8">
              <LoginForm />
            </div>

            <p className="text-center text-xs text-muted-foreground">
              Masjid Nurul Jannah &copy; {new Date().getFullYear()} • Hak Cipta Dilindungi
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
