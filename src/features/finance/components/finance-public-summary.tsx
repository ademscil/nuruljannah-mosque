import { formatDateIndonesia } from "@/lib/format-date";
import { formatRupiah } from "@/lib/format-rupiah";
import type {
  FinanceSummary,
  TransactionListItem,
} from "@/features/finance/types/transaction";

type FinancePublicSummaryProps = {
  summary: FinanceSummary;
  transactions: TransactionListItem[];
};

export function FinancePublicSummary({
  summary,
  transactions,
}: FinancePublicSummaryProps) {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Total Pemasukan", value: formatRupiah(summary.totalIncome) },
          { label: "Total Pengeluaran", value: formatRupiah(summary.totalExpense) },
          { label: "Saldo Kas", value: formatRupiah(summary.balance) },
        ].map((item) => (
          <div
            key={item.label}
            className="glass-panel aurora-border rounded-[1.8rem] p-6 shadow-[0_25px_70px_-45px_rgba(15,23,42,0.45)]"
          >
            <p className="text-sm text-muted-foreground">{item.label}</p>
            <p className="mt-3 text-2xl font-semibold tracking-tight">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4">
        {transactions.slice(0, 5).map((item) => (
          <div
            key={item.id}
            className="glass-panel rounded-[1.7rem] border border-white/40 px-5 py-4 shadow-[0_18px_50px_-35px_rgba(15,23,42,0.35)]"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-medium">{item.description}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {item.category} • {formatDateIndonesia(item.transactionAt)}
                </p>
              </div>
              <p className="text-sm font-semibold">
                {item.type === "INCOME" ? "+" : "-"} {formatRupiah(item.amount)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
