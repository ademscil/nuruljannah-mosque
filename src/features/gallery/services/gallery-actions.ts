"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { hasPermission } from "@/lib/role-guard";
import { prisma } from "@/lib/prisma";
import {
  galleryFormSchema,
  type GalleryFormSchema,
} from "@/features/gallery/schemas/gallery-form-schema";

type GalleryActionResult = {
  success: boolean;
  message: string;
};

export async function saveGalleryItemAction(
  input: GalleryFormSchema,
): Promise<GalleryActionResult> {
  const session = await auth();
  if (!session?.user || !hasPermission(session.user.role, "galeri")) {
    return { success: false, message: "Anda tidak memiliki akses modul galeri." };
  }

  const parsed = galleryFormSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: "Data galeri belum valid." };
  }

  try {
    await prisma.galleryItem.upsert({
      where: { id: parsed.data.id ?? "__new__" },
      update: {
        title: parsed.data.title,
        category: parsed.data.category,
        imageUrl: parsed.data.imageUrl,
        activityDate: new Date(parsed.data.activityDate),
        status: parsed.data.status,
      },
      create: {
        title: parsed.data.title,
        category: parsed.data.category,
        imageUrl: parsed.data.imageUrl,
        activityDate: new Date(parsed.data.activityDate),
        status: parsed.data.status,
        createdById: session.user.id,
      },
    });

    revalidatePath("/dashboard/galeri");
    revalidatePath("/galeri");
    return { success: true, message: "Galeri berhasil disimpan." };
  } catch {
    return { success: false, message: "Gagal menyimpan data galeri." };
  }
}

export async function deleteGalleryItemAction(id: string): Promise<GalleryActionResult> {
  const session = await auth();
  if (!session?.user || !hasPermission(session.user.role, "galeri")) {
    return { success: false, message: "Anda tidak memiliki akses modul galeri." };
  }

  try {
    await prisma.galleryItem.delete({ where: { id } });
    revalidatePath("/dashboard/galeri");
    revalidatePath("/galeri");
    return { success: true, message: "Galeri berhasil dihapus." };
  } catch {
    return { success: false, message: "Gagal menghapus galeri." };
  }
}
