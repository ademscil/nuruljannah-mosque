import { Landmark, ReceiptText, Scale, Wallet } from "lucide-react";

import { StatsCard } from "@/components/shared/stats-card";
import { formatRupiah } from "@/lib/format-rupiah";
import type { FinanceSummary } from "@/features/finance/types/transaction";

type FinanceSummaryCardsProps = {
  summary: FinanceSummary;
};

export function FinanceSummaryCards({
  summary,
}: FinanceSummaryCardsProps) {
  return (
    <div className="grid gap-4 xl:grid-cols-4">
      <StatsCard
        title="Total Pemasukan"
        value={formatRupiah(summary.totalIncome)}
        description="Akumulasi seluruh transaksi masuk."
        icon={Landmark}
      />
      <StatsCard
        title="Total Pengeluaran"
        value={formatRupiah(summary.totalExpense)}
        description="Akumulasi seluruh transaksi keluar."
        icon={Wallet}
      />
      <StatsCard
        title="Saldo Kas"
        value={formatRupiah(summary.balance)}
        description="Selisih pemasukan dan pengeluaran."
        icon={Scale}
      />
      <StatsCard
        title="Jumlah Transaksi"
        value={`${summary.transactionCount}`}
        description="Total entri transaksi tercatat."
        icon={ReceiptText}
      />
    </div>
  );
}
