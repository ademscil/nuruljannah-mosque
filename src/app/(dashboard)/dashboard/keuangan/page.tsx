import { PageHeader } from "@/components/shared/page-header";
import { FinanceChart } from "@/features/finance/components/finance-chart";
import { FinanceSummaryCards } from "@/features/finance/components/finance-summary-cards";
import { FinanceTransactionTable } from "@/features/finance/components/finance-transaction-table";
import {
  getFinanceChartData,
  getFinanceSummary,
  getTransactions,
} from "@/features/finance/services/transaction-service";

export default async function DashboardKeuanganPage() {
  const transactions = await getTransactions();
  const summary = getFinanceSummary(transactions);
  const chartData = getFinanceChartData(transactions);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="CMS Internal"
        title="Keuangan"
        description="Kelola transaksi pemasukan dan pengeluaran, filter kategori, ringkasan kas, dan ekspor laporan."
      />
      <FinanceSummaryCards summary={summary} />
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <FinanceChart data={chartData} />
        <div className="glass-panel aurora-border rounded-[2rem] p-6 shadow-[0_30px_90px_-50px_rgba(15,23,42,0.45)]">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700 dark:text-emerald-300">
            Ringkasan
          </p>
          <h3 className="mt-2 font-heading text-3xl font-semibold tracking-tight">
            Posisi kas masjid saat ini
          </h3>
          <div className="mt-6 space-y-4">
            <div className="rounded-[1.5rem] bg-muted/40 p-4">
              <p className="text-sm text-muted-foreground">Sumber data</p>
              <p className="mt-2 text-lg font-semibold">
                {transactions[0]?.source === "database"
                  ? "Supabase PostgreSQL"
                  : "Fallback Demo"}
              </p>
            </div>
            <div className="rounded-[1.5rem] bg-muted/40 p-4">
              <p className="text-sm text-muted-foreground">Status modul</p>
              <p className="mt-2 text-lg font-semibold">
                Summary, chart, filter, dan tabel aktif
              </p>
            </div>
            <div className="rounded-[1.5rem] bg-muted/40 p-4">
              <p className="text-sm text-muted-foreground">Tahap berikutnya</p>
              <p className="mt-2 text-lg font-semibold">
                Form CRUD transaksi dan upload lampiran
              </p>
            </div>
          </div>
        </div>
      </div>
      <FinanceTransactionTable transactions={transactions} />
    </div>
  );
}
