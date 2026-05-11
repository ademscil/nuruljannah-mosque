export type TransactionListItem = {
  id: string;
  type: "INCOME" | "EXPENSE";
  category: string;
  amount: number;
  transactionAt: string;
  description: string;
  attachmentUrl: string | null;
};

export type FinanceSummary = {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  transactionCount: number;
};

export type FinanceChartItem = {
  month: string;
  pemasukan: number;
  pengeluaran: number;
};
