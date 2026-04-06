import { AccessDenied } from "@/components/shared/access-denied";
import { PageHeader } from "@/components/shared/page-header";
import { FinanceChart } from "@/features/finance/components/finance-chart";
import { FinanceSummaryCards } from "@/features/finance/components/finance-summary-cards";
import { FinanceTransactionTable } from "@/features/finance/components/finance-transaction-table";
import { TransactionFormPanel } from "@/features/finance/components/transaction-form-panel";
import {
  getFinanceChartData,
  getFinanceSummary,
  getTransactions,
} from "@/features/finance/services/transaction-service";
import { hasDashboardPermission } from "@/lib/dashboard-access";

export default async function DashboardKeuanganPage() {
  const canAccess = await hasDashboardPermission("keuangan");
  if (!canAccess) {
    return <AccessDenied />;
  }

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
      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <FinanceChart data={chartData} />
        <div className="card-hero p-7">
          <div className="badge-primary mb-4">Panduan Penggunaan</div>
          <h3 className="font-heading text-2xl font-semibold tracking-tight">
            Cara mencatat keuangan
          </h3>
          <div className="mt-6 space-y-3">
            <div className="rounded-xl bg-muted/40 p-4">
              <p className="text-sm font-medium">1. Tambah transaksi baru</p>
              <p className="mt-1 text-sm text-muted-foreground">Pilih "Tambah Transaksi Baru" di form bawah, isi jenis, kategori, jumlah, dan tanggal.</p>
            </div>
            <div className="rounded-xl bg-muted/40 p-4">
              <p className="text-sm font-medium">2. Edit transaksi lama</p>
              <p className="mt-1 text-sm text-muted-foreground">Pilih transaksi dari dropdown di form bawah, ubah data yang perlu diperbarui, lalu simpan.</p>
            </div>
            <div className="rounded-xl bg-muted/40 p-4">
              <p className="text-sm font-medium">3. Hapus transaksi</p>
              <p className="mt-1 text-sm text-muted-foreground">Pilih transaksi di form, lalu klik tombol Hapus. Saldo kas akan otomatis diperbarui.</p>
            </div>
          </div>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <FinanceTransactionTable transactions={transactions} />
        <TransactionFormPanel transactions={transactions} />
      </div>
    </div>
  );
}
