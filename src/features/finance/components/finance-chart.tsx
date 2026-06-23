"use client";

import { Sparkles } from "lucide-react";
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
    <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-br from-background via-background to-muted/20 shadow-depth-lg backdrop-blur-sm">
      {/* Decorative gradient overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-amber-500/5" />

      <div className="relative space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20">
            <Sparkles className="size-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold tracking-tight text-foreground">
              Grafik Keuangan
            </h3>
            <p className="text-sm text-muted-foreground">
              Pemasukan dan pengeluaran bulanan
            </p>
          </div>
        </div>

        {/* Chart */}
        <div className="h-80 rounded-2xl border border-border/50 bg-card/30 p-4 backdrop-blur-sm">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid
                vertical={false}
                strokeDasharray="4 4"
                opacity={0.2}
              />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
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
                  borderRadius: "12px",
                  border: "1px solid rgba(255,255,255,0.2)",
                  backgroundColor: "rgba(255,255,255,0.95)",
                  boxShadow: "0 10px 40px -10px rgba(0,0,0,0.2)",
                }}
              />
              <Bar
                dataKey="pemasukan"
                fill="rgba(16, 185, 129, 0.9)"
                radius={[8, 8, 0, 0]}
              />
              <Bar
                dataKey="pengeluaran"
                fill="rgba(245, 158, 11, 0.85)"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
