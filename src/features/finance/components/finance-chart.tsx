"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { formatRupiah } from "@/lib/format-rupiah";
import type { FinanceChartItem } from "@/features/finance/types/transaction";

type FinanceChartProps = {
  data: FinanceChartItem[];
};

export function FinanceChart({ data }: FinanceChartProps) {
  return (
    <div className="glass-panel aurora-border rounded-[2rem] p-6 shadow-[0_30px_90px_-50px_rgba(15,23,42,0.45)]">
      <div className="mb-5">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700 dark:text-emerald-300">
          Grafik Keuangan
        </p>
        <h3 className="mt-2 font-heading text-3xl font-semibold tracking-tight">
          Pemasukan dan pengeluaran bulanan
        </h3>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid vertical={false} strokeDasharray="4 4" opacity={0.2} />
            <XAxis dataKey="month" axisLine={false} tickLine={false} />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) =>
                new Intl.NumberFormat("id-ID", {
                  notation: "compact",
                  maximumFractionDigits: 1,
                }).format(value)
              }
            />
            <Tooltip
              formatter={(value) => formatRupiah(Number(value ?? 0))}
              contentStyle={{
                borderRadius: "18px",
                border: "1px solid rgba(255,255,255,0.45)",
                boxShadow: "0 25px 70px -35px rgba(15,23,42,0.45)",
              }}
            />
            <Bar dataKey="pemasukan" fill="rgba(16, 185, 129, 0.9)" radius={[10, 10, 0, 0]} />
            <Bar dataKey="pengeluaran" fill="rgba(245, 158, 11, 0.85)" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
