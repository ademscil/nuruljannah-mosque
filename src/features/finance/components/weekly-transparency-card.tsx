import React from "react";
import Link from "next/link";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { formatRupiah } from "@/lib/format-rupiah";
import { formatDateIndonesia } from "@/lib/format-date";
import { ROUTE_PATHS } from "@/constants/routes";

export interface WeeklyTransparencyCardProps {
  report: {
    periodLabel: string;
    startingBalance: number;
    weeklyIncome: number;
    weeklyExpense: number;
    currentBalance: number;
    recentTransactions: Array<{
      id: string;
      type: "INCOME" | "EXPENSE";
      category: string;
      amount: number | string | { toString(): string };
      transactionAt: Date;
      description: string;
    }>;
  };
}

export function WeeklyTransparencyCard({ report }: WeeklyTransparencyCardProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-border/80 bg-card p-6 shadow-sm sm:p-8">
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
            <ShieldCheck className="size-3.5" />
            Transparansi Kas Masjid (Model Jogokariyan)
          </div>
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Laporan Keuangan Terbuka
          </h2>
          <p className="text-xs text-muted-foreground">
            Rekapitulasi mutasi {report.periodLabel}. Saldo dipertanggungjawabkan untuk kemakmuran umat.
          </p>
        </div>

        <Link
          href={ROUTE_PATHS.finance}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
        >
          Lihat Buku Kas Lengkap
          <ArrowRight className="size-3.5" />
        </Link>
      </div>

      {/* 4 Kartu Neraca Kas */}
      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {/* Saldo Awal Pekan */}
        <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
          <p className="text-xs font-medium text-muted-foreground">Saldo Awal Pekan</p>
          <p className="mt-1.5 text-base font-bold text-foreground sm:text-lg">
            {formatRupiah(report.startingBalance)}
          </p>
        </div>

        {/* Pemasukan Pekan Ini */}
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-50/40 p-4 dark:bg-emerald-950/20">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
              Pemasukan Pekan Ini
            </p>
            <TrendingUp className="size-4 text-emerald-600" />
          </div>
          <p className="mt-1.5 text-base font-bold text-emerald-700 dark:text-emerald-400 sm:text-lg">
            +{formatRupiah(report.weeklyIncome)}
          </p>
        </div>

        {/* Pengeluaran Pekan Ini */}
        <div className="rounded-2xl border border-rose-500/20 bg-rose-50/40 p-4 dark:bg-rose-950/20">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-rose-800 dark:text-rose-300">
              Pengeluaran Pekan Ini
            </p>
            <TrendingDown className="size-4 text-rose-600" />
          </div>
          <p className="mt-1.5 text-base font-bold text-rose-700 dark:text-rose-400 sm:text-lg">
            −{formatRupiah(report.weeklyExpense)}
          </p>
        </div>

        {/* Saldo Kas Saat Ini */}
        <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 dark:bg-primary/10">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-primary">Saldo Kas Berjalan</p>
            <Wallet className="size-4 text-primary" />
          </div>
          <p className="mt-1.5 text-lg font-extrabold text-primary sm:text-xl">
            {formatRupiah(report.currentBalance)}
          </p>
        </div>
      </div>

      {/* Mutasi Terkini */}
      <div className="mt-6 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Catatan Transaksi Terakhir
        </p>
        <div className="divide-y divide-border/60 rounded-2xl border border-border/60 bg-card overflow-hidden">
          {report.recentTransactions.length === 0 ? (
            <div className="p-4 text-center text-xs text-muted-foreground">
              Belum ada mutasi kas tercatat pekan ini.
            </div>
          ) : (
            report.recentTransactions.slice(0, 5).map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3.5 transition hover:bg-muted/20"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1 mr-2">
                  <div
                    className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${
                      item.type === "INCOME"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                        : "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                    }`}
                  >
                    {item.type === "INCOME" ? (
                      <ArrowUpRight className="size-4" />
                    ) : (
                      <ArrowDownRight className="size-4" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground truncate">
                      {item.description}
                    </p>
                    <p className="text-[11px] text-muted-foreground truncate">
                      {item.category} · {formatDateIndonesia(item.transactionAt)}
                    </p>
                  </div>
                </div>
                <p
                  className={`text-xs font-extrabold tracking-tight shrink-0 whitespace-nowrap ${
                    item.type === "INCOME"
                      ? "text-emerald-700 dark:text-emerald-400"
                      : "text-rose-700 dark:text-rose-400"
                  }`}
                >
                  {item.type === "INCOME" ? "+" : "−"} {formatRupiah(Number(item.amount))}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

