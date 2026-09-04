"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Fatal global layout error:", error);
  }, [error]);

  return (
    <html lang="id">
      <body className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-50 px-6 text-center text-slate-900 dark:bg-slate-950 dark:text-white">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400">
          <AlertTriangle className="size-8" />
        </div>
        <div className="space-y-2 max-w-md">
          <p className="text-xs font-bold uppercase tracking-wider text-rose-600">
            Kesalahan Sistem Fatal
          </p>
          <h1 className="text-2xl font-bold tracking-tight">
            Sistem sedang tidak dapat dimuat
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Terjadi kendala pada root layout aplikasi. Silakan muat ulang halaman.
          </p>
        </div>
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500"
        >
          Muat Ulang Aplikasi
        </button>
      </body>
    </html>
  );
}
