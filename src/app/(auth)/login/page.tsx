import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { ROUTE_PATHS } from "@/constants/routes";
import { LoginForm } from "@/features/auth/components/login-form";

export default async function LoginPage() {
  const session = await auth();

  if (session?.user) {
    redirect(ROUTE_PATHS.dashboard);
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.1fr_0.9fr]">
      <section className="hidden bg-[#123a33] px-10 py-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-200">
            Admin Area
          </p>
          <h1 className="max-w-lg font-heading text-5xl leading-tight tracking-tight">
            CMS internal Masjid Nurul Jannah siap dipakai.
          </h1>
          <p className="max-w-xl text-base leading-8 text-emerald-50/75">
            Login pengurus menggunakan Auth.js credentials, route dashboard
            terlindungi, dan skema role dasar sudah siap untuk modul CMS tahap
            berikutnya.
          </p>
        </div>
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <p className="text-sm text-emerald-100/75">Akun seed default</p>
          <div className="mt-3 space-y-2 text-sm">
            <p>Email: admin@nuruljannah.id</p>
            <p>Password: Admin123!</p>
          </div>
        </div>
      </section>

      <section className="flex items-center justify-center px-6 py-12 sm:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700 dark:text-emerald-300">
              Login Pengurus
            </p>
            <h2 className="text-3xl font-semibold tracking-tight">
              Masuk ke dashboard admin
            </h2>
            <p className="text-sm leading-6 text-muted-foreground">
              Gunakan akun pengurus yang tersedia di database untuk mengakses CMS
              internal.
            </p>
          </div>
          <div className="rounded-[2rem] border border-border/70 bg-card p-6 shadow-sm">
            <LoginForm />
          </div>
        </div>
      </section>
    </div>
  );
}
