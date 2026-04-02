import { prisma } from "@/lib/prisma";

export async function findAnnouncements() {
  return prisma.announcement.findMany({
    orderBy: [
      {
        publishedAt: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
  });
}
