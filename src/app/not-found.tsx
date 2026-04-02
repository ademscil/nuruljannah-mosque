import Link from "next/link";

import { ROUTE_PATHS } from "@/constants/routes";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="max-w-xl space-y-5 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700 dark:text-emerald-300">
          404
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">
          Halaman tidak ditemukan
        </h1>
        <p className="text-sm leading-6 text-muted-foreground">
          Route yang Anda buka belum tersedia atau sudah dipindahkan.
        </p>
        <Link
          href={ROUTE_PATHS.home}
          className="inline-flex h-10 items-center justify-center rounded-full bg-emerald-700 px-5 text-sm font-medium text-white transition hover:bg-emerald-800"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
