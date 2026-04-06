import Link from "next/link";
import { Building2 } from "lucide-react";
import { ROUTE_PATHS } from "@/constants/routes";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-6 text-center">
      <div className="flex size-20 items-center justify-center rounded-3xl bg-primary/8 text-primary animate-float">
        <Building2 className="size-10" />
      </div>
      <div className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-primary">404</p>
        <h1 className="font-heading text-4xl font-semibold tracking-tight">Halaman tidak ditemukan</h1>
        <p className="max-w-sm text-sm leading-7 text-muted-foreground">
          Route yang Anda buka belum tersedia atau sudah dipindahkan.
        </p>
      </div>
      <Link href={ROUTE_PATHS.home} className="btn-primary">
        Kembali ke Beranda
      </Link>
    </div>
  );
}
