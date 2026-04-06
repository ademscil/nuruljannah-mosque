import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { formatDateIndonesia } from "@/lib/format-date";
import { formatRupiah } from "@/lib/format-rupiah";
import type { FinanceSummary, TransactionListItem } from "@/features/finance/types/transaction";

type Props = { summary: FinanceSummary; transactions: TransactionListItem[] };

export function FinancePublicSummary({ summary, transactions }: Props) {
  const summaryCards = [
    {
      label: "Total Pemasukan",
      value: formatRupiah(summary.totalIncome),
      icon: TrendingUp,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      valueColor: "text-emerald-700",
    },
    {
      label: "Total Pengeluaran",
      value: formatRupiah(summary.totalExpense),
      icon: TrendingDown,
      iconBg: "bg-rose-50",
      iconColor: "text-rose-600",
      valueColor: "text-rose-700",
    },
    {
      label: "Saldo Kas",
      value: formatRupiah(summary.balance),
      icon: Wallet,
      iconBg: "bg-primary/8",
      iconColor: "text-primary",
      valueColor: "text-primary",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Summary cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {summaryCards.map((card) => (
          <div key={card.label} className="card-elevated group p-6 transition-all duration-300 hover:-translate-y-0.5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">{card.label}</p>
              <div className={`flex size-10 items-center justify-center rounded-xl ${card.iconBg} transition-transform duration-300 group-hover:scale-110`}>
                <card.icon className={`size-4 ${card.iconColor}`} />
              </div>
            </div>
            <p className={`mt-4 text-2xl font-bold tracking-tight ${card.valueColor}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Transaction list */}
      <div className="card-hero p-8">
        <div className="badge-primary mb-6">Transaksi Terbaru</div>
        <div className="space-y-3">
          {transactions.slice(0, 8).map((item, i) => (
            <div
              key={item.id}
              style={{ animationDelay: `${i * 40}ms` }}
              className="animate-fade-up flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-muted/30 px-5 py-4 transition-colors hover:bg-white"
            >
              <div className="flex items-center gap-3">
                <div className={`flex size-8 items-center justify-center rounded-full ${item.type === "INCOME" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
                  {item.type === "INCOME"
                    ? <ArrowUpRight className="size-4" />
                    : <ArrowDownRight className="size-4" />
                  }
                </div>
                <div>
                  <p className="font-semibold">{item.description}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {item.category} · {formatDateIndonesia(item.transactionAt)}
                  </p>
                </div>
              </div>
              <p className={`font-bold ${item.type === "INCOME" ? "text-emerald-700" : "text-rose-700"}`}>
                {item.type === "INCOME" ? "+" : "−"} {formatRupiah(item.amount)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
