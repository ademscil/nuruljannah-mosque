"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="id">
      <body className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
        <div className="max-w-lg space-y-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700 dark:text-emerald-300">
            Terjadi Kesalahan
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">
            Sistem sedang mengalami gangguan
          </h1>
          <p className="text-sm leading-6 text-muted-foreground">
            Silakan muat ulang halaman atau periksa konfigurasi database dan
            environment project.
          </p>
          <Button onClick={reset} className="rounded-full bg-emerald-700 hover:bg-emerald-800">
            Coba Lagi
          </Button>
        </div>
      </body>
    </html>
  );
}
