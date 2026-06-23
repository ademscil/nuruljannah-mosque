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
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatsCard
        title="Total Pemasukan"
        value={formatRupiah(summary.totalIncome)}
        description="Akumulasi seluruh transaksi dana masuk"
        icon={Landmark}
        iconColor="text-emerald-600"
        iconBg="bg-emerald-50"
      />
      <StatsCard
        title="Total Pengeluaran"
        value={formatRupiah(summary.totalExpense)}
        description="Akumulasi seluruh transaksi dana keluar"
        icon={Wallet}
        iconColor="text-amber-600"
        iconBg="bg-amber-50"
      />
      <StatsCard
        title="Saldo Kas"
        value={formatRupiah(summary.balance)}
        description="Selisih antara pemasukan dan pengeluaran"
        icon={Scale}
        iconColor="text-blue-600"
        iconBg="bg-blue-50"
      />
      <StatsCard
        title="Jumlah Transaksi"
        value={`${summary.transactionCount}`}
        description="Total entri transaksi yang tercatat"
        icon={ReceiptText}
        iconColor="text-purple-600"
        iconBg="bg-purple-50"
      />
    </div>
  );
}
