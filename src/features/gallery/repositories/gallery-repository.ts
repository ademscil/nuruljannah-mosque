import { prisma } from "@/lib/prisma";

export async function findGalleryItems() {
  return prisma.galleryItem.findMany({
    orderBy: [
      {
        activityDate: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
  });
}
