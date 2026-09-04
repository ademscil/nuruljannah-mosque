"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Root error boundary caught:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-600">
        <AlertTriangle className="size-8" />
      </div>
      <div className="space-y-2 max-w-md">
        <p className="text-xs font-bold uppercase tracking-wider text-rose-600">
          Terjadi Kendala
        </p>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Halaman mengalami kendala
        </h2>
        <p className="text-sm text-muted-foreground">
          Silakan coba muat ulang komponen ini atau periksa kembali koneksi Anda.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Button onClick={reset} className="rounded-xl">
          <RefreshCw className="size-4 mr-2" />
          Coba Lagi
        </Button>
      </div>
    </div>
  );
}
