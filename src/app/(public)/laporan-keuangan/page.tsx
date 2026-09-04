import { PageHeader } from "@/components/shared/page-header";
import { getCmsSettings } from "@/features/cms/services/cms-settings-service";
import { FinancePublicSummary } from "@/features/finance/components/finance-public-summary";
import { WeeklyTransparencyCard } from "@/features/finance/components/weekly-transparency-card";
import { getWeeklyCashReport } from "@/features/finance/repositories/transaction-repository";
import {
  getFinanceSummary,
  getTransactions,
} from "@/features/finance/services/transaction-service";

export default async function LaporanKeuanganPage() {
  const [transactions, cms, weeklyReport] = await Promise.all([
    getTransactions(),
    getCmsSettings(),
    getWeeklyCashReport(),
  ]);
  const summary = getFinanceSummary(transactions);

  return (
    <div className="space-y-12 pb-16">
      <PageHeader
        eyebrow="Transparansi Kas Umat"
        title={cms.contentBlocks.pageCopy.keuanganTitle || "Laporan Keuangan & Kas Terbuka"}
        description={
          cms.contentBlocks.pageCopy.keuanganDescription ||
          "Seluruh dana infaq, sedekah, dan wakaf yang diamanahkan dikelola secara terbuka dan dipertanggungjawabkan sepenuhnya untuk kemakmuran masjid dan ummat."
        }
      />

      {/* Kartu Transparansi Kas Mingguan (Model Jogokariyan) */}
      <section>
        <WeeklyTransparencyCard report={weeklyReport} />
      </section>

      {/* Ringkasan & Tabel Buku Kas Lengkap */}
      <section className="space-y-6">
        <div className="border-b border-border/60 pb-3">
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Buku Kas Masuk & Keluar Detail
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Riwayat seluruh transaksi mutasi kas kasir dan transfer perbankan yang telah diverifikasi bendahara.
          </p>
        </div>
        <FinancePublicSummary summary={summary} transactions={transactions} />
      </section>
    </div>
  );
}
