"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { hasPermission } from "@/lib/role-guard";
import { prisma } from "@/lib/prisma";
import {
  managementFormSchema,
  type ManagementFormSchema,
} from "@/features/management/schemas/management-form-schema";

type ManagementActionResult = {
  success: boolean;
  message: string;
};

export async function saveManagementMemberAction(
  input: ManagementFormSchema,
): Promise<ManagementActionResult> {
  const session = await auth();
  if (!session?.user || !hasPermission(session.user.role, "pengurus")) {
    return { success: false, message: "Anda tidak memiliki akses modul pengurus." };
  }

  const parsed = managementFormSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: "Data pengurus belum valid." };
  }

  try {
    await prisma.managementMember.upsert({
      where: { id: parsed.data.id ?? "__new__" },
      update: {
        name: parsed.data.name,
        position: parsed.data.position,
        phone: parsed.data.phone || null,
        email: parsed.data.email || null,
        termPeriod: parsed.data.termPeriod,
        photoUrl: parsed.data.photoUrl || null,
        status: parsed.data.status,
      },
      create: {
        name: parsed.data.name,
        position: parsed.data.position,
        phone: parsed.data.phone || null,
        email: parsed.data.email || null,
        termPeriod: parsed.data.termPeriod,
        photoUrl: parsed.data.photoUrl || null,
        status: parsed.data.status,
        createdById: session.user.id,
      },
    });

    revalidatePath("/dashboard/data-pengurus");
    revalidatePath("/profil-masjid");
    return { success: true, message: "Data pengurus berhasil disimpan." };
  } catch {
    return { success: false, message: "Gagal menyimpan data pengurus." };
  }
}

export async function deleteManagementMemberAction(
  id: string,
): Promise<ManagementActionResult> {
  const session = await auth();
  if (!session?.user || !hasPermission(session.user.role, "pengurus")) {
    return { success: false, message: "Anda tidak memiliki akses modul pengurus." };
  }

  try {
    await prisma.managementMember.delete({ where: { id } });
    revalidatePath("/dashboard/data-pengurus");
    revalidatePath("/profil-masjid");
    return { success: true, message: "Data pengurus berhasil dihapus." };
  } catch {
    return { success: false, message: "Gagal menghapus data pengurus." };
  }
}
