"use server";

import { compare, hash } from "bcryptjs";
import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getPrismaActionErrorMessage } from "@/lib/prisma-action-error";
import {
  accountSettingsSchema,
  type AccountSettingsSchema,
} from "@/features/settings/schemas/account-settings-schema";

type AccountSettingsActionResult = {
  success: boolean;
  message: string;
};

export async function saveAccountSettingsAction(
  input: AccountSettingsSchema,
): Promise<AccountSettingsActionResult> {
  const session = await auth();

  if (!session?.user) {
    return { success: false, message: "Sesi login tidak ditemukan." };
  }

  const parsed = accountSettingsSchema.safeParse(input);

  if (!parsed.success) {
    const errorMsg = parsed.error.issues.map((i) => i.message).join(", ") || "Data akun belum valid.";
    return { success: false, message: errorMsg };
  }

  try {
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!currentUser) {
      // If demo account in dev mode
      if (session.user.id.startsWith("demo-")) {
        return {
          success: true,
          message: "Akun demo berhasil diperbarui secara lokal untuk simulasi sesi ini.",
        };
      }
      return { success: false, message: "Pengguna tidak ditemukan di database." };
    }

    if (parsed.data.password) {
      if (!parsed.data.currentPassword) {
        return {
          success: false,
          message: "Password saat ini wajib diisi untuk mengubah password.",
        };
      }

      const isCurrentPasswordValid = await compare(
        parsed.data.currentPassword,
        currentUser.passwordHash,
      );

      if (!isCurrentPasswordValid) {
        return {
          success: false,
          message: "Password saat ini salah. Periksa kembali password lama Anda.",
        };
      }
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone || null,
        ...(parsed.data.password
          ? {
              passwordHash: await hash(parsed.data.password, 10),
            }
          : {}),
      },
    });

    revalidatePath("/dashboard/pengaturan-akun");
    return { success: true, message: "Pengaturan akun berhasil disimpan." };
  } catch (error) {
    return {
      success: false,
      message: getPrismaActionErrorMessage(error, "Gagal menyimpan pengaturan akun."),
    };
  }
}
