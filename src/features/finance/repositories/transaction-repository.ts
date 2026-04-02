import { prisma } from "@/lib/prisma";

export async function findTransactions() {
  return prisma.transaction.findMany({
    orderBy: [
      {
        transactionAt: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
  });
}
