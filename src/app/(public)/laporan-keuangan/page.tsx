import { PageHeader } from "@/components/shared/page-header";
import { FinancePublicSummary } from "@/features/finance/components/finance-public-summary";
import {
  getFinanceSummary,
  getTransactions,
} from "@/features/finance/services/transaction-service";

export default async function LaporanKeuanganPage() {
  const transactions = await getTransactions();
  const summary = getFinanceSummary(transactions);

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Halaman Publik"
        title="Laporan Keuangan Ringkas"
        description="Ringkasan pemasukan, pengeluaran, dan saldo kas untuk transparansi kepada jamaah."
      />
      <FinancePublicSummary summary={summary} transactions={transactions} />
    </div>
  );
}
