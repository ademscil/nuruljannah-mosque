"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);

  return (
    <html lang="id">
      <body className="flex min-h-screen flex-col items-center justify-center gap-8 bg-[oklch(0.982_0.004_80)] px-6 text-center text-foreground">
        <div className="flex size-20 items-center justify-center rounded-3xl bg-rose-50 text-rose-600">
          <AlertTriangle className="size-10" />
        </div>
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-rose-600">Terjadi Kesalahan</p>
          <h1 className="font-heading text-3xl font-semibold tracking-tight">Sistem sedang mengalami gangguan</h1>
          <p className="max-w-sm text-sm leading-7 text-muted-foreground">
            Silakan muat ulang halaman atau periksa konfigurasi database dan environment project.
          </p>
        </div>
        <Button
          onClick={reset}
          className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          Coba Lagi
        </Button>
      </body>
    </html>
  );
}
