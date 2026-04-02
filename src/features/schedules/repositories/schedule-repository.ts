import { prisma } from "@/lib/prisma";

export async function findSchedules() {
  return prisma.schedule.findMany({
    orderBy: [
      {
        scheduleFor: "asc",
      },
      {
        createdAt: "desc",
      },
    ],
  });
}
