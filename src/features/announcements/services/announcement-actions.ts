"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { hasPermission } from "@/lib/role-guard";
import { prisma } from "@/lib/prisma";
import {
  announcementFormSchema,
  type AnnouncementFormSchema,
} from "@/features/announcements/schemas/announcement-form-schema";

type AnnouncementActionResult = {
  success: boolean;
  message: string;
};

export async function saveAnnouncementAction(
  input: AnnouncementFormSchema,
): Promise<AnnouncementActionResult> {
  const session = await auth();

  if (!session?.user || !hasPermission(session.user.role, "pengumuman")) {
    return { success: false, message: "Anda tidak memiliki akses modul ini." };
  }

  const parsed = announcementFormSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, message: "Data pengumuman belum valid." };
  }

  try {
    await prisma.announcement.upsert({
      where: {
        id: parsed.data.id ?? "__new__",
      },
      update: {
        title: parsed.data.title,
        slug: parsed.data.slug,
        content: parsed.data.content,
        category: parsed.data.category,
        status: parsed.data.status,
        publishedAt:
          parsed.data.status === "PUBLISHED"
            ? parsed.data.publishedAt
              ? new Date(parsed.data.publishedAt)
              : new Date()
            : null,
        thumbnailUrl: parsed.data.thumbnailUrl || null,
      },
      create: {
        title: parsed.data.title,
        slug: parsed.data.slug,
        content: parsed.data.content,
        category: parsed.data.category,
        status: parsed.data.status,
        publishedAt:
          parsed.data.status === "PUBLISHED"
            ? parsed.data.publishedAt
              ? new Date(parsed.data.publishedAt)
              : new Date()
            : null,
        thumbnailUrl: parsed.data.thumbnailUrl || null,
        createdById: session.user.id,
      },
    });

    revalidatePath("/dashboard/pengumuman");
    revalidatePath("/pengumuman");

    return { success: true, message: "Pengumuman berhasil disimpan." };
  } catch {
    return { success: false, message: "Gagal menyimpan pengumuman." };
  }
}

export async function deleteAnnouncementAction(
  id: string,
): Promise<AnnouncementActionResult> {
  const session = await auth();

  if (!session?.user || !hasPermission(session.user.role, "pengumuman")) {
    return { success: false, message: "Anda tidak memiliki akses modul ini." };
  }

  try {
    await prisma.announcement.delete({ where: { id } });

    revalidatePath("/dashboard/pengumuman");
    revalidatePath("/pengumuman");

    return { success: true, message: "Pengumuman berhasil dihapus." };
  } catch {
    return { success: false, message: "Gagal menghapus pengumuman." };
  }
}
