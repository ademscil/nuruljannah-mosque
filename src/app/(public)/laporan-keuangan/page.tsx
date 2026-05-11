import { PageHeader } from "@/components/shared/page-header";
import { getCmsSettings } from "@/features/cms/services/cms-settings-service";
import { FinancePublicSummary } from "@/features/finance/components/finance-public-summary";
import {
  getFinanceSummary,
  getTransactions,
} from "@/features/finance/services/transaction-service";

export default async function LaporanKeuanganPage() {
  const [transactions, cms] = await Promise.all([getTransactions(), getCmsSettings()]);
  const summary = getFinanceSummary(transactions);

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Halaman Publik"
        title={cms.contentBlocks.pageCopy.keuanganTitle}
        description={cms.contentBlocks.pageCopy.keuanganDescription}
      />
      <FinancePublicSummary summary={summary} transactions={transactions} />
    </div>
  );
}
