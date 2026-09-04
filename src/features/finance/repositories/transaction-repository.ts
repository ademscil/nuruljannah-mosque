import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export async function findTransactions() {
  return prisma.transaction.findMany({
    orderBy: [
      { transactionAt: "desc" },
      { createdAt: "desc" },
    ],
  });
}

export async function findTransactionById(id: string) {
  return prisma.transaction.findUnique({
    where: { id },
  });
}

export async function createTransaction(data: Prisma.TransactionCreateInput) {
  return prisma.transaction.create({ data });
}

export async function updateTransaction(id: string, data: Prisma.TransactionUpdateInput) {
  return prisma.transaction.update({ where: { id }, data });
}

export async function deleteTransaction(id: string) {
  return prisma.transaction.delete({ where: { id } });
}

export interface WeeklyCashReport {
  periodLabel: string;
  startingBalance: number;
  weeklyIncome: number;
  weeklyExpense: number;
  currentBalance: number;
  recentTransactions: Array<{
    id: string;
    type: "INCOME" | "EXPENSE";
    category: string;
    amount: number;
    transactionAt: Date;
    description: string;
  }>;
}

export async function getWeeklyCashReport(): Promise<WeeklyCashReport> {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const diffToMonday = (dayOfWeek === 0 ? -6 : 1) - dayOfWeek;
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() + diffToMonday);
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  const formatShortDate = (d: Date) => d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
  const periodLabel = "Pekan Ini (" + formatShortDate(startOfWeek) + " - " + formatShortDate(endOfWeek) + ")";

  try {
    const [allBefore, weekTx, recent] = await Promise.all([
      prisma.transaction.findMany({
        where: { transactionAt: { lt: startOfWeek } },
        select: { type: true, amount: true },
      }),
      prisma.transaction.findMany({
        where: { transactionAt: { gte: startOfWeek, lte: endOfWeek } },
        select: { type: true, amount: true },
      }),
      prisma.transaction.findMany({
        take: 5,
        orderBy: { transactionAt: "desc" },
      }),
    ]);

    let startingBalance = 0;
    for (const tx of allBefore) {
      const num = Number(tx.amount);
      if (tx.type === "INCOME") startingBalance += num;
      else startingBalance -= num;
    }

    let weeklyIncome = 0;
    let weeklyExpense = 0;
    for (const tx of weekTx) {
      const num = Number(tx.amount);
      if (tx.type === "INCOME") weeklyIncome += num;
      else weeklyExpense -= num;
    }

    const currentBalance = startingBalance + weeklyIncome - weeklyExpense;

    return {
      periodLabel,
      startingBalance,
      weeklyIncome,
      weeklyExpense,
      currentBalance,
      recentTransactions: recent.map((r) => ({
        id: r.id,
        type: r.type,
        category: r.category,
        amount: Number(r.amount),
        transactionAt: r.transactionAt,
        description: r.description,
      })),
    };
  } catch (err) {
    console.error("Failed to load weekly cash report:", err);
    return {
      periodLabel,
      startingBalance: 0,
      weeklyIncome: 0,
      weeklyExpense: 0,
      currentBalance: 0,
      recentTransactions: [],
    };
  }
}