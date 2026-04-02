import type {
  FinanceChartItem,
  FinanceSummary,
  TransactionListItem,
} from "@/features/finance/types/transaction";
import { findTransactions } from "@/features/finance/repositories/transaction-repository";

const fallbackTransactions: TransactionListItem[] = [
  {
    id: "trx-demo-1",
    type: "INCOME",
    category: "Donasi Jum'at",
    amount: 6250000,
    transactionAt: "2026-04-01T09:00:00+07:00",
    description: "Pemasukan kotak amal Jum'at pekan pertama.",
    attachmentUrl: null,
    source: "fallback",
  },
  {
    id: "trx-demo-2",
    type: "EXPENSE",
    category: "Operasional Listrik",
    amount: 1450000,
    transactionAt: "2026-04-02T10:00:00+07:00",
    description: "Pembayaran listrik dan air bulan April.",
    attachmentUrl: null,
    source: "fallback",
  },
  {
    id: "trx-demo-3",
    type: "INCOME",
    category: "Infak Ramadhan",
    amount: 8500000,
    transactionAt: "2026-04-03T12:00:00+07:00",
    description: "Infak jamaah untuk program Ramadhan.",
    attachmentUrl: null,
    source: "fallback",
  },
];

export async function getTransactions(): Promise<TransactionListItem[]> {
  try {
    const transactions = await findTransactions();

    if (transactions.length === 0) {
      return fallbackTransactions;
    }

    return transactions.map((transaction) => ({
      id: transaction.id,
      type: transaction.type,
      category: transaction.category,
      amount: Number(transaction.amount),
      transactionAt: transaction.transactionAt.toISOString(),
      description: transaction.description,
      attachmentUrl: transaction.attachmentUrl ?? null,
      source: "database",
    }));
  } catch {
    return fallbackTransactions;
  }
}

export function getFinanceSummary(
  transactions: TransactionListItem[],
): FinanceSummary {
  const totalIncome = transactions
    .filter((item) => item.type === "INCOME")
    .reduce((sum, item) => sum + item.amount, 0);
  const totalExpense = transactions
    .filter((item) => item.type === "EXPENSE")
    .reduce((sum, item) => sum + item.amount, 0);

  return {
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
    transactionCount: transactions.length,
  };
}

export function getFinanceChartData(
  transactions: TransactionListItem[],
): FinanceChartItem[] {
  const monthMap = new Map<string, FinanceChartItem>();

  transactions.forEach((item) => {
    const date = new Date(item.transactionAt);
    const month = new Intl.DateTimeFormat("id-ID", {
      month: "short",
    }).format(date);

    if (!monthMap.has(month)) {
      monthMap.set(month, {
        month,
        pemasukan: 0,
        pengeluaran: 0,
      });
    }

    const current = monthMap.get(month);

    if (!current) {
      return;
    }

    if (item.type === "INCOME") {
      current.pemasukan += item.amount;
    } else {
      current.pengeluaran += item.amount;
    }
  });

  return Array.from(monthMap.values()).reverse();
}
