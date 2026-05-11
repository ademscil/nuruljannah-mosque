import type {
  FinanceChartItem,
  FinanceSummary,
  TransactionListItem,
} from "@/features/finance/types/transaction";
import { findTransactions } from "@/features/finance/repositories/transaction-repository";

export async function getTransactions(): Promise<TransactionListItem[]> {
  try {
    const transactions = await findTransactions();
    return transactions.map((transaction) => ({
      id: transaction.id,
      type: transaction.type,
      category: transaction.category,
      amount: Number(transaction.amount),
      transactionAt: transaction.transactionAt.toISOString(),
      description: transaction.description,
      attachmentUrl: transaction.attachmentUrl ?? null,
    }));
  } catch (error) {
    console.error("Failed to load transactions:", error);
    return [];
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
