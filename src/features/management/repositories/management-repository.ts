import { prisma } from "@/lib/prisma";

export async function findManagementMembers() {
  return prisma.managementMember.findMany({
    orderBy: [
      {
        createdAt: "asc",
      },
      {
        name: "asc",
      },
    ],
  });
}
