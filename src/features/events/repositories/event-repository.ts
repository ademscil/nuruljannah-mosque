import { prisma } from "@/lib/prisma";

export async function findEvents() {
  return prisma.event.findMany({
    orderBy: [
      {
        date: "asc",
      },
      {
        createdAt: "desc",
      },
    ],
  });
}
